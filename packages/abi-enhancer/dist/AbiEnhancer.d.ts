import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IEnhancedResult, IAbiEnhancer, IEnhanceStrategy } from '@rsksmart/rif-wallet/packages/types';
export declare class AbiEnhancer implements IAbiEnhancer {
    strategies: IEnhanceStrategy[];
    constructor();
    enhance(signer: Signer, transactionRequest: TransactionRequest): Promise<IEnhancedResult | null>;
}
