import { Signer, BigNumberish, BytesLike, BigNumber } from 'ethers';
import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider';
import { TypedDataSigner } from '@ethersproject/abstract-signer';
import { SmartWalletFactory } from './SmartWalletFactory';
import { SmartWallet } from './SmartWallet';
declare type IRequest<Type, Payload, ReturnType, ConfirmArgs> = {
    type: Type;
    payload: Payload;
    returnType: ReturnType;
    confirm: (args?: ConfirmArgs) => Promise<void>;
    reject: (reason?: any) => void;
};
export declare type OverriddableTransactionOptions = {
    gasLimit: BigNumberish;
    gasPrice: BigNumberish;
};
export declare type SendTransactionRequest = IRequest<'sendTransaction', [
    transactionRequest: TransactionRequest
], TransactionResponse, Partial<OverriddableTransactionOptions>>;
export declare type SignMessageRequest = IRequest<'signMessage', [
    message: BytesLike
], string, void>;
declare type SignTypedDataArgs = Parameters<TypedDataSigner['_signTypedData']>;
export declare type SignTypedDataRequest = IRequest<'signTypedData', SignTypedDataArgs, string, void>;
export declare type Request = SendTransactionRequest | SignMessageRequest | SignTypedDataRequest;
export declare type OnRequest = (request: Request) => void;
declare type RequestType = Request['type'];
declare type RequestPayload = Request['payload'];
declare type RequestReturnType = Request['returnType'];
declare type RequestConfirm = Request['confirm'];
declare type RequestConfirmOverrides = Parameters<RequestConfirm>[0];
declare type CreateDoRequestOnConfirm = (payload: RequestPayload, overrides: RequestConfirmOverrides) => Promise<RequestReturnType>;
declare type CreateDoRequest = (type: RequestType, onConfirm: CreateDoRequestOnConfirm) => (...payload: RequestPayload) => Promise<RequestReturnType>;
export declare class RIFWallet extends Signer implements TypedDataSigner {
    smartWallet: SmartWallet;
    smartWalletFactory: SmartWalletFactory;
    onRequest: OnRequest;
    private constructor();
    get address(): string;
    get smartWalletAddress(): string;
    static create(signer: Signer, smartWalletFactoryAddress: string, onRequest: OnRequest): Promise<RIFWallet>;
    getAddress: () => Promise<string>;
    signTransaction: (transaction: TransactionRequest) => Promise<string>;
    call(transactionRequest: TransactionRequest, blockTag?: BlockTag): Promise<any>;
    createDoRequest: CreateDoRequest;
    sendTransaction: (transactionRequest: TransactionRequest) => Promise<TransactionResponse>;
    signMessage: (message: BytesLike) => Promise<string>;
    _signTypedData: (domain: import("@ethersproject/abstract-signer").TypedDataDomain, types: Record<string, import("@ethersproject/abstract-signer").TypedDataField[]>, value: Record<string, any>) => Promise<string>;
    estimateGas(transaction: TransactionRequest): Promise<BigNumber>;
    connect: (provider: Provider) => Signer;
}
export {};
