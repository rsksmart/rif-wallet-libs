import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'
export declare class CallsResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: Signer);
    resolve(params: any[]): Promise<string>;
}
