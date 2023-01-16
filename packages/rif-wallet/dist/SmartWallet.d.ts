import { Contract, BytesLike, ContractTransaction, BigNumber, Signer } from 'ethers';
export declare class SmartWallet {
    address: string;
    smartWalletContract: Contract;
    get signer(): Signer;
    get smartWalletAddress(): string;
    private constructor();
    static create(signer: Signer, smartWalletAddress: string): Promise<SmartWallet>;
    directExecute: (to: string, data: BytesLike, ...args: any) => Promise<ContractTransaction>;
    estimateDirectExecute: (to: string, data: BytesLike, ...args: any) => Promise<BigNumber>;
    callStaticDirectExecute: (to: string, data: BytesLike, ...args: any) => Promise<any>;
}
