import { RIFWallet } from '@rsksmart/rif-wallet';
import { IResolver } from '../RPCAdapter';
export declare class RequestAccountsResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: RIFWallet);
    resolve(): Promise<string[]>;
}
