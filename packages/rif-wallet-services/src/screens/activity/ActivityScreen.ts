import {
  IApiTransaction,
  IAbiEnhancer, IEnhancedResult
} from '@rsksmart/rif-wallet/packages/types'
import { RIFWallet } from '@rsksmart/rif-wallet/packages/core'

export const enhanceTransactionInput = async (
  transaction: IApiTransaction,
  wallet: RIFWallet,
  abiEnhancer: IAbiEnhancer
): Promise<IEnhancedResult | undefined> => {
  let tx
  try {
    tx = wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
      'directExecute',
      transaction.input
    )
    return (await abiEnhancer.enhance(wallet, {
      from: wallet.smartWalletAddress,
      to: tx.to.toLowerCase(),
      data: tx.data,
      value: transaction.value
    }))!
  } catch {
    return undefined
  }
}
