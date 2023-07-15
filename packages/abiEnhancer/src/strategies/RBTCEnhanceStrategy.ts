import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { formatBigNumber } from '../formatBigNumber'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { getRbtcSymbol } from '../utils'

export class RBTCEnhanceStrategy implements EnhanceStrategy {
  public async parse (
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ): Promise<EnhancedResult | null> {
    const tokenDecimals = 18
    const symbol = getRbtcSymbol(chainId)

    return {
      ...transactionRequest,
      symbol,
      value: formatBigNumber(
        BigNumber.from(transactionRequest.value),
        tokenDecimals
      )
    }
  }
}
