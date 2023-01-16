import { Signer } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { IEnhancedResult, IEnhanceStrategy } from '@rsksmart/rif-wallet-types';
export declare class RBTCEnhanceStrategy implements IEnhanceStrategy {
    parse(signer: Signer, transactionRequest: TransactionRequest): Promise<IEnhancedResult | null>;
}
