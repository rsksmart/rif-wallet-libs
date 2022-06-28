/// <reference types="node" />
import EventEmitter from 'events';
import { IAbiEnhancer, IRIFWalletServicesFetcher, IServiceChangeEvent, IServiceInitEvent } from '@rsksmart/rif-wallet-types';
import { RIFWallet } from '@rsksmart/rif-wallet-core';
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
