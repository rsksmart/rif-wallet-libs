import { Wallet, ContractTransaction, ContractReceipt, providers, BigNumber, Signer } from 'ethers';
import { ReactTestInstance } from 'react-test-renderer';
import { ERC20Token } from '../../token/src/ERC20Token';
import { RBTCToken } from '../../token/src/RBTCToken';
export declare const testJsonRpcProvider: providers.JsonRpcProvider;
export declare const rpcAccount: providers.JsonRpcSigner;
export declare const sendAndWait: (txPromise: Promise<ContractTransaction>) => Promise<ContractReceipt>;
export declare const fundAccount: (to: string) => Promise<providers.TransactionResponse>;
export declare const createNewTestWallet: (privateKey?: string | undefined) => Promise<Wallet>;
export declare const getTextFromTextNode: (textNode: ReactTestInstance) => string | ReactTestInstance;
export declare type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export declare const TEST_TOKEN_DECIMALS = 18;
export declare const TEST_CHAIN_ID = 31;
export declare const getSigner: (index?: number) => providers.JsonRpcSigner;
export declare const deployTestTokens: (accountSigner: Signer, initialBalance?: BigNumber) => Promise<{
    firstErc20Token: ERC20Token;
    secondErc20Token: ERC20Token;
    rbtcToken: RBTCToken;
}>;
