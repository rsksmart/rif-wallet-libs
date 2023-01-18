import {
  BIPFetcher,
  BitcoinTransactionContainerType,
  ISendTransactionJsonReturnData,
  UnspentTransactionType,
  XPubBalanceData
} from '../types'

/**
 * DefaultFetcher created but this is a DUMMY class. The developer must implement BIPFetcher.
 */
export class DefaultFetcher implements BIPFetcher {
  async fetchXpubBalance () {
    return {} as unknown as XPubBalanceData
  }

  async fetchXpubTransactions () {
    return {} as unknown as BitcoinTransactionContainerType
  }

  async fetchXpubNextUnusedIndex () {
    return 0 as unknown as number
  }

  async fetchUtxos () {
    return [] as unknown as UnspentTransactionType[]
  }

  async sendTransactionHexData () {
    return {} as unknown as ISendTransactionJsonReturnData
  }
}
