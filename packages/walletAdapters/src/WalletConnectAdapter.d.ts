import { Signer } from 'ethers';
import { RPCAdapter } from './RPCAdapter';
export declare class WalletConnectAdapter extends RPCAdapter {
    constructor(signer: Signer);
}
