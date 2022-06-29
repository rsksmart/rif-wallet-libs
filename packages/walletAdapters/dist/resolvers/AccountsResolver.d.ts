import { RIFWallet } from '@rsksmart/rif-wallet-core';
import { IResolver } from '../RPCAdapter';
export declare class AccountsResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: RIFWallet);
    resolve(): Promise<string[]>;
}
