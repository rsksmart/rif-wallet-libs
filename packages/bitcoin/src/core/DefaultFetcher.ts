import {
  BIPFetcher,
  BitcoinTransactionContainerType,
  FetchBitcoinMiningFeeRatesReturnType,
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
    return { index: 0, availableIndexes: [0, 1, 2, 3, 4] } as unknown as { index: number, availableIndexes: number[] }
  }

  async fetchUtxos () {
    return [] as unknown as UnspentTransactionType[]
  }

  async sendTransactionHexData () {
    return {} as unknown as ISendTransactionJsonReturnData
  }

  async fetchBitcoinMiningFeeRates<T extends 'blockbook' | 'cypher'>(
  ): Promise<FetchBitcoinMiningFeeRatesReturnType<T>> {
    return {} as FetchBitcoinMiningFeeRatesReturnType<T>
  }
}
