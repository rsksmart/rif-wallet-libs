import { Signer } from 'ethers';
import { IResolver } from '../RPCAdapter';
export declare class BlockNumberResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: Signer);
    resolve(): Promise<number>;
}
