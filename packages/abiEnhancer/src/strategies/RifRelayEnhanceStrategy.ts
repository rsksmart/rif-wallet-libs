import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { formatBigNumber } from '../formatBigNumber'
import { findToken } from './ERC20EnhanceStrategy'
import { ERC20__factory } from '@rsksmart/rif-wallet-token'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getDefaultNodeUrl, getRbtcSymbol } from '../utils'

interface ForwardRequestStruct {
  relayHub: string
  from: string
  to: string
  tokenContract: string
  value: BigNumberish
  gas: BigNumberish
  nonce: BigNumberish
  tokenAmount: BigNumberish
  tokenGas: BigNumberish
  validUntilTime: BigNumberish
  data: BytesLike
};
interface ForwardRequest {
  request: ForwardRequestStruct,
  relayData: {
    callForwarder: string
  }
}

export class RifRelayEnhanceStrategy implements EnhanceStrategy {
  private strategies: EnhanceStrategy[]

  constructor(strategies: EnhanceStrategy[]) {
    this.strategies = strategies
  }

  public async parse(chainId: number, transactionRequest: TransactionRequest, nodeUrl?: string) : Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }
    let tx
    try {
      tx = relayHubInterface.decodeFunctionData('relayCall', transactionRequest.data)
    } catch (e) {
      return null
    }

    const { request: { tokenContract, tokenAmount, data, to, value }, relayData: { callForwarder } } = tx.relayRequest as ForwardRequest

    const url = nodeUrl || getDefaultNodeUrl(chainId)
    const provider = new JsonRpcProvider(url)
    const feeTokenFounded = await findToken(provider, tokenContract)
    const rbtcSymbol = getRbtcSymbol(chainId)
    let tokenSymbol = rbtcSymbol
    let tokenDecimals = 18
    try {
      const tokenFounded = ERC20__factory.connect(to, provider)
      tokenSymbol = await tokenFounded.symbol()
      tokenDecimals = await tokenFounded.decimals()
    } catch (e) {

    }
    if (!feeTokenFounded) {
      return null
    }
    const feeTokenDecimals = await feeTokenFounded.decimals()
    let result
    for (const strategy of this.strategies) {
      result = await strategy.parse(chainId, {
        from: transactionRequest.from,
        data,
        value: transactionRequest.value,
        to
      }, nodeUrl)
      if (result) {
        break
      }
    }
    return {
      to: result?.to || to,
      from: callForwarder,
      symbol: tokenSymbol,
      value: result?.value || formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals) || 0,
      feeSymbol: feeTokenFounded.symbol,
      feeValue: formatBigNumber(BigNumber.from(tokenAmount), feeTokenDecimals)
    }
  }
}
