import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { ERC20EnhanceStrategy, OtherEnhanceStrategy, RBTCEnhanceStrategy } from './strategies'
import { BytesLike } from '@ethersproject/bytes'
import { BigNumberish } from '@ethersproject/bignumber'

export interface FunctionParameter {
  name: string
  value: any
}

export interface EnhancedResult {
  from?: string
  to?: string
  symbol?: string
  balance?: string
  value?: BigNumberish
  data?: BytesLike | string
  functionName?: string
  functionParameters?: FunctionParameter[]
}

export interface EnhanceStrategy {
  parse: (
    signer: Signer,
    transactionRequest: TransactionRequest,
  ) => Promise<EnhancedResult | null>
}

export interface IAbiEnhancer {
  enhance(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<EnhancedResult | null>
}

export class AbiEnhancer implements IAbiEnhancer {
  public strategies: EnhanceStrategy[]

  constructor () {
    this.strategies = [
      new ERC20EnhanceStrategy(),
      new OtherEnhanceStrategy(),
      new RBTCEnhanceStrategy()
    ]
  }

  public async enhance (
    signer: Signer,
    transactionRequest: TransactionRequest
  ): Promise<EnhancedResult | null> {
    for (const strategy of this.strategies) {
      const result = await strategy.parse(signer, transactionRequest)

      if (result) {
        return result
      }
    }

    return null
  }
}