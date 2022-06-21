import { Contract, ContractTransaction, Signer } from 'ethers'
interface ISmartWalletFactory {
    getSmartWalletAddress(): Promise<string>;
    isDeployed(): Promise<boolean>;
    deploy(): Promise<ContractTransaction>;
}
/**
 * This is a Smart Wallet Factory contract helper for a given Wallet
 */
export declare class SmartWalletFactory implements ISmartWalletFactory {
    smartAddress: string;
    smartWalletFactoryContract: Contract;
    private constructor();
    private static getSmartWalletParams;
    static create(signer: Signer, smartWalletFactoryContractAddress: string): Promise<SmartWalletFactory>;
    getSmartWalletAddress: () => Promise<string>;
    isDeployed: () => Promise<boolean>;
    deploy: () => Promise<ContractTransaction>;
}
export {}
