import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'
export declare class GetTransactionByHashResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: Signer);
    resolve(params: any[]): Promise<import('@ethersproject/abstract-provider').TransactionResponse | undefined>;
}
