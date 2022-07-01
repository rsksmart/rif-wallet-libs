import { BigNumber, BigNumberish, Signer, ContractTransaction } from 'ethers';
export declare type TokenType = 'erc20' | 'rbtc';
export declare class BaseToken {
    signer: Signer;
    symbol: string;
    logo: string;
    constructor(signer: Signer, symbol: string, logo: string);
    protected getAccountAddress(): Promise<string>;
}
export interface ITransferOptions {
    gasPrice: BigNumberish;
    gasLimit: BigNumberish;
    nonce: BigNumberish;
}
export interface IToken {
    getType: () => TokenType;
    decimals: () => Promise<number>;
    balance: () => Promise<BigNumber>;
    transfer: (recipientAddress: string, amount: BigNumberish, options?: ITransferOptions) => Promise<ContractTransaction>;
    logo: string;
    symbol: string;
    address: string;
}
export declare const ten: BigNumber;
export declare const tenPow: (exp: BigNumberish) => BigNumber;
