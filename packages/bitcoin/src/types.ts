import { BIP32Interface } from 'bip32'
import { Psbt, Network, HDSigner } from 'bitcoinjs-lib'
import BIPRequestPaymentFacade from './facades/BIPRequestPaymentFacade'
import BitcoinNetwork from './core/BitcoinNetwork'
import BIPWithRequest from './facades/BIPWithRequest'
import BIP from './core/BIP'

export { BIP32Interface, Psbt, Network, HDSigner }

export interface TransactionInputType {
  hash: string
  index: number
  witnessUtxo: {
    script: Buffer
    value: number
  }
  bip32Derivation: {
    masterFingerprint: Buffer
    path: string
    pubkey: Buffer
  }[]
}

export interface NetworkInfoType {
  bip32: { public: number; private: number }
  wif: number
  bech32: string
}

export interface UnspentTransactionType {
  txid: string
  vout: number
  value: string
  path: string
  address: string
  confirmations: number
}
/**
 * amountToPay: number
 * addressToPay: string
 * unspentTransactions: Array<>
 * miningFee: number
 */
export interface PaymentType {
  amountToPay: number
  addressToPay: string
  unspentTransactions: Array<UnspentTransactionType>
  miningFee: number
}

export type PaymentTypeWithBalance = PaymentType & { balance: number }

export type EstimateFeeType = Omit<PaymentType, 'miningFee'>

type PaymentTypeWithPaymentFacade = PaymentType & {
  payment: BIPRequestPaymentFacade
  balance: number
}

export interface IPayment {
  generatePayment: (
    amountToPay: number,
    addressToPay: string,
    unspentTransactions: UnspentTransactionType[],
    miningFee: number,
  ) => Psbt
  signPayment: (psbt: Psbt) => Psbt
  convertPaymentToHexString: (psbt: Psbt) => string
}

export type PaymentFactoryType = (
  paymentType: string,
  bip32root: BIP32Interface,
  networkInfo: NetworkInfoType,
) => IPayment

export type BitcoinNetworkWithBIPRequest = Omit<BitcoinNetwork, 'bips'> & {
  bips: BIPWithRequest[]
}

export type createBipFactoryType = ConstructorParameters<typeof BIP>

export interface XPubBalanceData {
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  txs: number
  btc: number
}

export interface VinType {
  txid: string
  vout: number
  sequence: string
  n: number
  addresses: string[]
  isAddress: boolean
  value: string
}

export interface VoutType {
  value: string
  n: number
  hex: string
  addresses: string[]
  isAddress: boolean
}

export interface BitcoinTransactionType {
  txid: string
  version: number
  vin: VinType[]
  vout: VoutType[]
  blockHash: string
  blockHeight: number
  confirmations: number
  blockTime: number
  value: string
  valueIn: string
  fees: string
  hex: string
  isBitcoin: boolean
}

export interface BitcoinTransactionContainerType {
  page: number
  totalPages: number
  itemsOnPage: number
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  unconfirmedBalance: string
  unconfirmedTxs: number
  txs: number
  transactions: BitcoinTransactionType[]
  usedTokens: number
}

export interface ISendTransactionJsonReturnData {
  error?: string
  result?: string
}

export interface BIPFetcher {
  fetchXpubBalance: (xpub: string) => Promise<XPubBalanceData>
  fetchUtxos: (xpub: string) => Promise<Array<UnspentTransactionType>>
  fetchXpubNextUnusedIndex: (xpub: string) => Promise<number>
  fetchXpubTransactions: (
    xpub: string,
    pageSize: number | undefined,
    pageNumber: number,
  ) => Promise<BitcoinTransactionContainerType>
  sendTransactionHexData: (hexdata: string) => Promise<ISendTransactionJsonReturnData>
}

export interface BitcoinRequest {
  type: string,
  payload: PaymentTypeWithPaymentFacade,
  confirm: () => Promise<void>,
  reject: (reason?: any) => void
}

export type BitcoinRequestFunction = (payload: BitcoinRequest) => void

export interface BIPOptionsType {
  request?: BitcoinRequestFunction
  fetcher: BIPFetcher
  paymentFactory?: PaymentFactoryType
}

export type OnSendTransactionFunction = (hexdata: string) => Promise<ISendTransactionJsonReturnData>
