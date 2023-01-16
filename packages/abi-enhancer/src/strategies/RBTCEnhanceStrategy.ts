import { BigNumber, Signer } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { formatBigNumber } from '../formatBigNumber'
import { IEnhancedResult, IEnhanceStrategy } from '@rsksmart/rif-wallet-types'
import { makeRBTCToken } from '@rsksmart/rif-wallet-token'

export class RBTCEnhanceStrategy implements IEnhanceStrategy {
  public async parse (
    signer: Signer,
    transactionRequest: TransactionRequest
  ): Promise<IEnhancedResult | null> {
    const chainId = await signer.getChainId()

    const rbtc = makeRBTCToken(signer, chainId)

    const currentBalance = await rbtc.balance()
    const tokenDecimals = await rbtc.decimals()
    const symbol = rbtc.symbol

    return {
      ...transactionRequest,
      symbol,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      value: formatBigNumber(
        BigNumber.from(transactionRequest.value),
        tokenDecimals
      )
    }
  }
}
