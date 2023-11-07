import { BIP32Interface } from 'bip32'
import { Psbt, Network, HDSigner } from 'bitcoinjs-lib'
import { BIPRequestPaymentFacade } from './facades/BIPRequestPaymentFacade'
import { BitcoinNetwork } from './core/BitcoinNetwork'
import { BIPWithRequest } from './facades/BIPWithRequest'
import { BIP } from './core/BIP'

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
  addressToReturnRemainingAmount?: string
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
    addressToReturnRemainingAmount?: string
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
  isOwn?: boolean
}

export interface VoutType {
  value: string
  n: number
  hex: string
  addresses: string[]
  isAddress: boolean
  isOwn?: boolean
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

export type FetchBitcoinMiningFeeRatesReturnType<T extends string> =
  T extends 'blockbook' ? { result: string } :
    T extends 'cypher' ? {
        name: string
        height: number
        hash: string
        time: string
        latest_url: string
        previous_hash: string
        previous_url: string
        peer_count: number
        unconfirmed_count: number
        high_fee_per_kb: number
        medium_fee_per_kb: number
        low_fee_per_kb: number
        last_fork_height: number
        last_fork_hash: string
        timeCached: number
      }
      :
      never

export interface BIPFetcher {
  fetchXpubBalance: (xpub: string) => Promise<XPubBalanceData>
  fetchUtxos: (xpub: string) => Promise<UnspentTransactionType[]>
  fetchXpubNextUnusedIndex: (xpub: string,
                             changeIndex?: number,
                             knownLastUsedIndex?: number,
                             maxIndexesToFetch?: number,) => Promise<{ index: number, availableIndexes: number[] }>
  fetchXpubTransactions: (
    xpub: string,
    pageSize: number | undefined,
    pageNumber: number,
  ) => Promise<BitcoinTransactionContainerType>
  sendTransactionHexData: (hexdata: string) => Promise<ISendTransactionJsonReturnData>
  fetchBitcoinMiningFeeRates: <T extends 'blockbook' | 'cypher'>(
    apiSource?: T,
    numberOfBlocks?: number
  ) => Promise<FetchBitcoinMiningFeeRatesReturnType<T>>;
}

export interface SendBitcoinRequest {
  type: 'SEND_BITCOIN',
  payload: PaymentTypeWithPaymentFacade,
  returnType?: void,
  confirm: () => Promise<void>,
  reject: (reason?: any) => void
}

export type BitcoinRequestFunction = (payload: SendBitcoinRequest) => void

export interface BIPOptionsType {
  request?: BitcoinRequestFunction
  fetcher?: BIPFetcher
  paymentFactory?: PaymentFactoryType
}

export type OnSendTransactionFunction = (hexdata: string) => Promise<ISendTransactionJsonReturnData>
