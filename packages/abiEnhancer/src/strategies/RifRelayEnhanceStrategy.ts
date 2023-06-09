import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { formatBigNumber } from '../formatBigNumber'
import { findToken } from './ERC20EnhanceStrategy'

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

    const { request: { tokenContract, tokenAmount, data, to }, relayData: { callForwarder } } = tx.relayRequest as ForwardRequest

    const tokenFounded = await findToken(signer, tokenContract)
    if (!tokenFounded) {
      return null
    }
    const tokenDecimals = await tokenFounded.decimals()
    const currentBalance = await tokenFounded.balance()
    let result
    for (const strategy of this.strategies) {
      result = await strategy.parse(signer, {
        from: transactionRequest.from,
        data,
        value: transactionRequest.value,
        to: tokenContract
      })
      if (result) {
        break
      }
    }
    return {
      to: result?.to || to,
      from: callForwarder,
      symbol: tokenFounded.symbol,
      value: result?.value || 0,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      feeSymbol: tokenFounded.symbol,
      feeValue: formatBigNumber(BigNumber.from(tokenAmount), tokenDecimals)
    }
  }
}
