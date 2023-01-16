import { Signer } from 'ethers';
import { IResolver } from '../RPCAdapter';
export declare class GetBlockByNumberResolver implements IResolver {
    private signer;
    methodName: string;
    constructor(signer: Signer);
    resolve([blockOrTag]: any): Promise<import("@ethersproject/abstract-provider").Block>;
}
