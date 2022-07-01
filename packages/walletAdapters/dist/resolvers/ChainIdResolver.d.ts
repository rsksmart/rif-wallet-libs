import { Signer } from 'ethers';
import { IResolver } from '../RPCAdapter';
export declare class ChainIdResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: Signer);
    resolve(): Promise<string>;
}
