import * as React from 'react';
import { IApiTransaction, IEvent, IRIFWalletServicesFetcher, ITokenWithBalance } from '../RIFWallet/RIFWalletServicesTypes';
import { IAbiEnhancer, IEnhancedResult } from '../AbiEnhancer/AbiEnhancerTypes';
export interface IActivityTransaction {
    originTransaction: IApiTransaction;
    enhancedTransaction?: IEnhancedResult;
}
export interface TransactionsServerResponse {
    data: IApiTransaction[];
    next: string | null | undefined;
    prev: string | null | undefined;
}
export interface TransactionsServerResponseWithActivityTransactions extends TransactionsServerResponse {
    activityTransactions: IActivityTransaction[];
}
export interface IActivity extends TransactionsServerResponseWithActivityTransactions {
}
export interface IPrice {
    price: number;
    lastUpdated: string;
}
export interface NewTransactionsAction {
    type: 'newTransactions';
    payload: IActivity;
}
export interface NewBalanceAction {
    type: 'newBalance';
    payload: ITokenWithBalance;
}
export interface NewPriceAction {
    type: 'newPrice';
    payload: Record<string, {
        price: number;
        lastUpdated: string;
    }>;
}
export interface NewTransactionAction {
    type: 'newTransaction';
    payload: IActivityTransaction;
}
export interface NewTokenTransferAction {
    type: 'newTokenTransfer';
    payload: IEvent;
}
export interface InitAction {
    type: 'init';
    payload: {
        transactions: IActivityTransaction[];
        balances: ITokenWithBalance[];
    };
}
export interface State {
    transactions: TransactionsServerResponseWithActivityTransactions;
    balances: Record<string, ITokenWithBalance>;
    prices: Record<string, IPrice>;
    events: Array<IEvent>;
}
export declare type Action = NewTransactionsAction | NewBalanceAction | NewPriceAction | NewTransactionAction | NewTokenTransferAction | InitAction;
export declare type Dispatch = (action: Action) => void;
export declare type SubscriptionsProviderProps = {
    children: React.ReactNode;
    rifServiceSocket?: IRIFWalletServicesFetcher;
    abiEnhancer: IAbiEnhancer;
};
export declare type ActivityScreenProps = {
    fetcher: IRIFWalletServicesFetcher;
    abiEnhancer: IAbiEnhancer;
};
export interface FetchTransactionsOptions {
    next: string | null;
    prev: string | null;
    fetcher: IRIFWalletServicesFetcher;
    abiEnhancer: IAbiEnhancer;
}
