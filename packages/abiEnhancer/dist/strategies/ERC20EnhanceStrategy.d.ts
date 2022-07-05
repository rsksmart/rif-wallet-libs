import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IEnhancedResult, IEnhanceStrategy } from '@rsksmart/rif-wallet/packages/types';
export declare class ERC20EnhanceStrategy implements IEnhanceStrategy {
    parse(signer: Signer, transactionRequest: TransactionRequest): Promise<IEnhancedResult | null>;
}
