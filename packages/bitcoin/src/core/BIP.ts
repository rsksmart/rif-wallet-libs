import { PathDerivator } from './PathDerivator'
import { BIP_DATA, COIN_BIPS } from '../constants'
import { AddressFactory } from '../factories/AddressFactory'
import { getPaymentInstance } from '../factories/getPaymentInstance'
import {
  BIP32Interface,
  BIPOptionsType,
  PaymentFactoryType,
  IPayment, BIPFetcher
} from '../types'

import { fromSeed } from 'bip32'
import { Network } from 'bitcoinjs-lib'
import { DefaultFetcher } from './DefaultFetcher'

export class BIP {
  PathDerivator: PathDerivator
  bipId: string
  bipNumber: number
  bip32Root!: BIP32Interface
  account!: BIP32Interface
  accountPublicKey!: string
  accountPrivateKey!: string
  networkInfo!: Network
  AddressFactory!: AddressFactory
  fetcher!: BIPFetcher
  balance!: number
  btc!: number
  bipName: string
  paymentType: string
  paymentFactory!: PaymentFactoryType
  payment!: IPayment
  options: BIPOptionsType
  constructor (
    coinTypeNumber: number,
    networkId: string,
    bipId: string,
    seed: Buffer,
    options: BIPOptionsType = {}
  ) {
    this.bipId = bipId
    this.bipNumber = BIP_DATA[bipId].number
    this.bipName = BIP_DATA[bipId].name
    this.paymentType = 'p2wpkh' // For escalation use constants.ts and implement a paymentType constant there for all BIPs
    this.PathDerivator = new PathDerivator(
      this.bipNumber,
      coinTypeNumber,
      0
    )
    this.options = options
    this.setOptions()
    this.setBIP32RootKey(seed, networkId)
    this.setAccount()
    this.setNetworkInfo(networkId)
    this.setPaymentInstance()
    this.setAddressFactory()
  }

  setOptions () {
    this.fetcher = this.options.fetcher || new DefaultFetcher()
    this.paymentFactory = this.options.paymentFactory || getPaymentInstance
  }

  setBIP32RootKey (seed: Buffer, networkId: string) {
    this.bip32Root = fromSeed(
      seed,
      COIN_BIPS[networkId][this.bipId]
    )
  }

  setAccount () {
    const accountDerivation = this.PathDerivator.getAccountDerivation()
    this.account = this.bip32Root.derivePath(accountDerivation)
    this.accountPrivateKey = this.account.toBase58()
    this.accountPublicKey = this.account.neutered().toBase58()
  }

  setNetworkInfo (networkId: string) {
    this.networkInfo = COIN_BIPS[networkId][this.bipId]
  }

  setPaymentInstance () {
    this.payment = this.paymentFactory(
      this.paymentType,
      this.bip32Root,
      this.networkInfo
    )
  }

  setAddressFactory () {
    this.AddressFactory = new AddressFactory(this.bipNumber, this.networkInfo)
  }

  getAddress (index = 0): string {
    const bip32Instance = this.bip32Root.derivePath(
      this.PathDerivator.getAddressDerivation(index)
    )
    return this.AddressFactory.getAddress(bip32Instance.publicKey)
  }

  async fetchBalance () {
    const data = await this.fetcher.fetchXpubBalance(
      this.accountPublicKey
    )
    this.balance = parseInt(data.balance, 10)
    this.btc = data.btc || 0
    return this.btc
  }

  async fetchUtxos () {
    return await this.fetcher.fetchUtxos(
      this.accountPublicKey
    )
  }

  async fetchExternalAvailableAddress () {
    const index =
      await this.fetcher.fetchXpubNextUnusedIndex(
        this.accountPublicKey
      )
    return this.getAddress(index)
  }

  async fetchTransactions (pageSize = 10, pageNumber = 1) {
    return this.fetcher.fetchXpubTransactions(
      this.accountPublicKey,
      pageSize,
      pageNumber
    )
  }
}
