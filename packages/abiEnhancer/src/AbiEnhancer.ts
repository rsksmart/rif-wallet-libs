import { TransactionRequest } from '@ethersproject/abstract-provider'
import {
  ERC20EnhanceStrategy, OtherEnhanceStrategy,
  RBTCEnhanceStrategy, RifRelayEnhanceStrategy
} from './strategies'
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
  feeSymbol?: string
  feeValue?: BigNumberish
  data?: BytesLike | string
  functionName?: string
  functionParameters?: FunctionParameter[]
}

export interface EnhanceStrategy {
  parse: (
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ) => Promise<EnhancedResult | null>
}

export interface IAbiEnhancer {
  enhance(
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ): Promise<EnhancedResult | null>
}

export class AbiEnhancer implements IAbiEnhancer {
  public strategies: EnhanceStrategy[]

  constructor () {
    this.strategies = [
      new RifRelayEnhanceStrategy(),
      new ERC20EnhanceStrategy(),
      new OtherEnhanceStrategy(),
      new RBTCEnhanceStrategy()
    ]
  }

  public async enhance (
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ): Promise<EnhancedResult | null> {
    for (const strategy of this.strategies) {
      const result = await strategy.parse(chainId, transactionRequest, nodeUrl)

      if (result) {
        return result
      }
    }

    return null
  }
}
