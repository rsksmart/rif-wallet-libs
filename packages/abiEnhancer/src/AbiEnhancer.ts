import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
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

const erc20EnhanceStrategy = new ERC20EnhanceStrategy()
const otherEnhanceStrategy = new OtherEnhanceStrategy()

export class AbiEnhancer implements IAbiEnhancer {
  public strategies: EnhanceStrategy[]

  constructor () {
    this.strategies = [
      new RifRelayEnhanceStrategy([erc20EnhanceStrategy, otherEnhanceStrategy]),
      erc20EnhanceStrategy,
      otherEnhanceStrategy,
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
