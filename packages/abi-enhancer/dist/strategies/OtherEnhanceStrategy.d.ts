import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IEnhancedResult, IEnhanceStrategy } from '@rsksmart/rif-wallet-types';
export declare class OtherEnhanceStrategy implements IEnhanceStrategy {
    parse(signer: Signer, transactionRequest: TransactionRequest): Promise<IEnhancedResult | null>;
}
