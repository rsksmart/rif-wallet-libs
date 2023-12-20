import { ContractReceipt } from '@ethersproject/contracts'
import EventEmitter from 'events'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import { RifWalletServicesSocket } from './RifWalletServicesSocket'

export interface IApiTokens {
  address: string
  balance: string
  blockNumber: number
  isNative: false
  name: string
  symbol: string
  totalSupply: number
  type: string
  contract: string
  contractInterfaces: string[]
  contractMethods: string[]
  decimals: string
}

export interface TokensServerResponse {
  data: IApiTokens[]
}

export interface IToken {
  name: string
  logo: string
  symbol: string
  contractAddress: string
  decimals: number
}

export interface ITokenWithBalance extends IToken {
  balance: string
}

export interface IApiEvents {
  address: string
  blockHash: string
  blockNumber: number
  data: string
  event: string
  timestamp: number
  topics: string[]
  args: string[]
  transactionHash: string
  transactionIndex: number
  txStatus: string
}

export interface IEvent {
  blockNumber: number
  event: string
  timestamp: number
  topics: string[]
  args: string[]
  transactionHash: string
  txStatus: string
}

export interface EventsServerResponse {
  data: IApiEvents[]
}

export interface IApiTransaction {
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  from: string
  to: string
  gas: number
  gasPrice: string
  value: string
  input: string
  timestamp: number
  receipt?: ContractReceipt
  txType: string
  txId: string
  data?: string
}

export interface PendingTransaction {
  to: string
  valueConverted: string
  nonce: number
  hash: string
  from: string
  gasPrice?: string
  data?: string
}
export interface TransactionsServerResponse {
  data: IApiTransaction[]
  next: string | null | undefined
  prev: string | null | undefined
}

export type onSetInternetCredentials<Options, Return> = (
  server: string,
  username: string,
  password: string,
  options?: Options
) => Return

export type RifWalletFetcherDependencies = {
  defaultChainId: string
  resultsLimit?: number
}

export interface IRegisteredDapp {
  title: string
  url: string
  allowedNetworks: number[]
}

export interface IRegisteredDappsGroup {
  groupName: string
  dapps: IRegisteredDapp[]
}

export interface RIFWalletServicesFetcherInterface {
  fetchTokensByAddress(address: string): Promise<ITokenWithBalance[]>
  fetchTransactionsByAddress(
    address: string,
    prev?: string | null,
    next?: string | null,
    blockNumber?: string | null,
  ): Promise<TransactionsServerResponse>
  fetchDapps(): Promise<IRegisteredDappsGroup[]>
}

export interface IXPubBalanceData {
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  txs: number
  btc: number
}

export interface ISendTransactionJsonReturnData {
  error?: string
  result?: string
}

// SOCKET types

export interface IServiceChangeEvent {
  type: string
  payload: unknown
}

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: EnhancedResult
}

export interface IServiceInitEvent {
  transactions: IActivityTransaction[]
  balances: ITokenWithBalance[]
}

export interface Header {
  [key: string] : string
}

export interface IRifWalletServicesSocket extends EventEmitter {
  connect: (
    address: string,
    chainId: number,
    headers: Header
  ) => void

  disconnect(): void
  isConnected(): boolean

  on(event: 'init', listener: (result: IServiceInitEvent) => void): this
  on(event: 'change', listener: (result: IServiceChangeEvent) => void): this
}

export type FilterOutRepeatedTransactionsFunction = (
  transaction: IActivityTransaction,
  index: number,
  self: Array<IActivityTransaction>) => boolean;

export interface CacheInterface {
  get: (key: string) => any
  set: (key: string, value: boolean | string | number | object) => unknown
  has: (key: string) => boolean
}

export type OnBeforeInitFunction = (currentInstance: RifWalletServicesSocket) => void

export type EnhanceTransactionFunction = (transaction: IApiTransaction, chainId: number) => Promise<EnhancedResult | null>

export type RifWalletSocketDependencies = {
  onFilterOutRepeatedTransactions: FilterOutRepeatedTransactionsFunction
  cache: CacheInterface
  onBeforeInit: OnBeforeInitFunction
  onEnhanceTransaction: EnhanceTransactionFunction
}

export interface SearchAddressDetailsFunction {
  address: string
  blockNumber?: string
  prev?: string
  next?: string
  limit?: string
}

export interface AddressDetailsResponse {
  tokens: ITokenWithBalance[]
  prices: Record<string, { price: number, lastUpdated: string }>
  transactions: TransactionsServerResponse
}
