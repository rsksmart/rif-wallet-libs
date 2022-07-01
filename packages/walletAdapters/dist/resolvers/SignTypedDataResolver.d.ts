import { RIFWallet } from '@rsksmart/rif-wallet-core';
import { IResolver } from '../RPCAdapter';
export declare class SignTypedDataResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: RIFWallet);
    resolve(params: any[]): Promise<string>;
}
