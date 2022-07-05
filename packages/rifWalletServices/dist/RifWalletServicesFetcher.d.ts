import { IRegisteredDappsGroup, IRIFWalletServicesFetcher, ITokenWithBalance } from '@rsksmart/rif-wallet/packages/types';
export declare class RifWalletServicesFetcher implements IRIFWalletServicesFetcher {
    uri: string;
    constructor(uri: string);
    protected fetchAvailableTokens(): Promise<any>;
    fetchTransactionsByAddress: (smartAddress: string, prev?: string | null | undefined, next?: string | null | undefined) => Promise<any>;
    fetchEventsByAddress: (smartAddress: string) => Promise<any>;
    fetchTokensByAddress: (address: string) => Promise<ITokenWithBalance[]>;
    fetchDapps: () => Promise<IRegisteredDappsGroup[]>;
}
