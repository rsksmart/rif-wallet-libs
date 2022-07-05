import { IApiTransaction, IAbiEnhancer, IEnhancedResult } from '@rsksmart/rif-wallet/packages/types';
import { RIFWallet } from '@rsksmart/rif-wallet/packages/core';
export declare const enhanceTransactionInput: (transaction: IApiTransaction, wallet: RIFWallet, abiEnhancer: IAbiEnhancer) => Promise<IEnhancedResult | undefined>;
