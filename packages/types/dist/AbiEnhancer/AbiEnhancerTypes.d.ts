import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
export interface IEnhancedResult {
    from?: string;
    to?: string;
    [key: string]: any;
}
export interface IEnhanceStrategy {
    parse: (signer: Signer, transactionRequest: TransactionRequest) => Promise<IEnhancedResult | null>;
}
export interface IAbiEnhancer {
    enhance(signer: Signer, transactionRequest: TransactionRequest): Promise<IEnhancedResult | null>;
}
