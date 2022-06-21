/// <reference types="node" />
import EventEmitter from 'events'
import { IActivityTransaction } from './subscriptions/types'
import { IAbiEnhancer } from '../../abiEnhancer/src/AbiEnhancer'
import { RIFWallet } from '../../core/src/RIFWallet'
import { IRIFWalletServicesFetcher } from './RifWalletServicesFetcher'
import { ITokenWithBalance } from './RIFWalletServicesTypes'
export interface IServiceChangeEvent {
    type: string;
    payload: any;
}
export interface IServiceInitEvent {
    transactions: IActivityTransaction[];
    balances: ITokenWithBalance[];
}
export interface IRifWalletServicesSocket extends EventEmitter {
    connect: (wallet: RIFWallet) => Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    on(event: 'init', listener: (result: IServiceInitEvent) => void): this;
    on(event: 'change', listener: (result: IServiceChangeEvent) => void): this;
}
export declare class RifWalletServicesSocket extends EventEmitter implements IRifWalletServicesSocket {
    private rifWalletServicesUrl;
    private fetcher;
    private abiEnhancer;
    private socket;
    constructor(rifWalletServicesUrl: string, fetcher: IRIFWalletServicesFetcher, abiEnhancer: IAbiEnhancer);
    private init;
    connect(wallet: RIFWallet): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
}
