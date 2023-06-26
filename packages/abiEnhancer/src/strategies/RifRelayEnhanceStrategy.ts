import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { formatBigNumber } from '../formatBigNumber'
import { findToken } from './ERC20EnhanceStrategy'
import { ERC20__factory, MAINNET_CHAINID } from '@rsksmart/rif-wallet-token'

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

  public async parse(signer: Signer, transactionRequest: TransactionRequest) : Promise<EnhancedResult | null> {
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

    const feeTokenFounded = await findToken(signer, tokenContract)
    const chainId = await signer.getChainId()
    const rbtcSymbol = chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
    let tokenSymbol = rbtcSymbol
    let tokenDecimals = 18
    let tokenBalance = BigNumber.from(0)
    try {
      const tokenFounded = ERC20__factory.connect(to, signer)
      tokenSymbol = await tokenFounded.symbol()
      tokenDecimals = await tokenFounded.decimals()
      tokenBalance = await tokenFounded.balanceOf(await signer.getAddress())
    } catch (e) {

    }
    if (!feeTokenFounded) {
      return null
    }
    const feeTokenDecimals = await feeTokenFounded.decimals()
    let result
    for (const strategy of this.strategies) {
      result = await strategy.parse(signer, {
        from: transactionRequest.from,
        data,
        value: transactionRequest.value,
        to
      })
      if (result) {
        break
      }
    }
    return {
      to: result?.to || to,
      from: callForwarder,
      symbol: tokenSymbol,
      value: result?.value || formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals) || 0,
      balance: formatBigNumber(tokenBalance, tokenDecimals),
      feeSymbol: feeTokenFounded.symbol,
      feeValue: formatBigNumber(BigNumber.from(tokenAmount), feeTokenDecimals)
    }
  }
}
