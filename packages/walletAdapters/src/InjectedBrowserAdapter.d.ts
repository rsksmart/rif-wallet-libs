import { Signer } from 'ethers';
import { RPCAdapter } from './RPCAdapter';
export declare class InjectedBrowserAdapter extends RPCAdapter {
    constructor(signer: Signer);
}
