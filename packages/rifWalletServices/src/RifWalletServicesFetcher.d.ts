import { ITokenWithBalance, TransactionsServerResponse } from './RIFWalletServicesTypes';
export interface IRIFWalletServicesFetcher {
    fetchTokensByAddress(address: string): Promise<ITokenWithBalance[]>;
    fetchTransactionsByAddress(address: string, prev?: string | null, next?: string | null): Promise<TransactionsServerResponse>;
    fetchDapps(): Promise<IRegisteredDappsGroup[]>;
}
export interface IRegisteredDapp {
    title: string;
    url: string;
    allowedNetworks: number[];
}
export interface IRegisteredDappsGroup {
    groupName: string;
    dapps: IRegisteredDapp[];
}
export declare class RifWalletServicesFetcher implements IRIFWalletServicesFetcher {
    uri: string;
    constructor(uri: string);
    protected fetchAvailableTokens(): Promise<any>;
    fetchTransactionsByAddress: (smartAddress: string, prev?: string | null | undefined, next?: string | null | undefined) => Promise<any>;
    fetchEventsByAddress: (smartAddress: string) => Promise<any>;
    fetchTokensByAddress: (address: string) => Promise<ITokenWithBalance[]>;
    fetchDapps: () => Promise<IRegisteredDappsGroup[]>;
}
