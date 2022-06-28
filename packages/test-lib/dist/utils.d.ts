import { Wallet, ContractTransaction, ContractReceipt, providers } from 'ethers';
export declare const testJsonRpcProvider: providers.JsonRpcProvider;
export declare const rpcAccount: providers.JsonRpcSigner;
export declare const sendAndWait: (tx: Promise<ContractTransaction>) => Promise<ContractReceipt>;
export declare const fundAccount: (to: string) => Promise<providers.TransactionResponse>;
export declare const createNewTestWallet: () => Promise<Wallet>;
