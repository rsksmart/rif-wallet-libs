import { IApiTransaction, IAbiEnhancer, IEnhancedResult } from '@rsksmart/rif-wallet-types';
import { RIFWallet } from '@rsksmart/rif-wallet-core';
export declare const enhanceTransactionInput: (transaction: IApiTransaction, wallet: RIFWallet, abiEnhancer: IAbiEnhancer) => Promise<IEnhancedResult | undefined>;
