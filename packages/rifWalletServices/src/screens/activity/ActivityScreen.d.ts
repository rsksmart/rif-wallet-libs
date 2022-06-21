import { IApiTransaction } from '../../rifWalletServices/src/RIFWalletServicesTypes'
import { IAbiEnhancer, IEnhancedResult } from '../../abiEnhancer/src/AbiEnhancer'
import { RIFWallet } from '../../core/src'
export declare const enhanceTransactionInput: (transaction: IApiTransaction, wallet: RIFWallet, abiEnhancer: IAbiEnhancer) => Promise<IEnhancedResult | undefined>
