import {
  SearchAddressDetailsFunction,
  AddressDetailsResponse,
  IRegisteredDappsGroup,
  ITokenWithBalance, IXPubBalanceData,
  RifWalletFetcherDependencies, RIFWalletServicesFetcherInterface,
  TransactionsServerResponse,
} from './types'
import {
  BitcoinTransactionContainerType,
  FetchBitcoinMiningFeeRatesReturnType,
  UnspentTransactionType
} from '@rsksmart/rif-wallet-bitcoin'
import { AxiosInstance } from 'axios'

export class RifWalletServicesFetcher implements RIFWalletServicesFetcherInterface {
  axiosInstance: AxiosInstance
  defaultChainId: string
  resultsLimit: number
  constructor(
    axiosInstance: AxiosInstance,
    dependencies: RifWalletFetcherDependencies
  ) {
    this.axiosInstance = axiosInstance
    // Dependencies injection
    this.defaultChainId = dependencies.defaultChainId
    this.resultsLimit = dependencies.resultsLimit || 10

    this.axiosInstance.interceptors.request.use(
      config => {
        config.params = { ...config.params, chainId: this.defaultChainId }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )
  }

  protected async fetchAvailableTokens() {
    return this.axiosInstance.get('/tokens')
  }

  fetchTransactionsByAddress = (
    smartAddress: string,
    prev?: string | null,
    next?: string | null,
    blockNumber?: string | null,
  ) => {
    let transactionsUrl = `/address/${smartAddress}/transactions?limit=${this.resultsLimit}`

    if (prev) {
      transactionsUrl = `${transactionsUrl}&prev=${prev}`
    } else if (next) {
      transactionsUrl = `${transactionsUrl}&next=${next}`
    }

    if (blockNumber !== null) {
      transactionsUrl = `${transactionsUrl}&blockNumber=${blockNumber}`
    }

    return this.axiosInstance
      .get<TransactionsServerResponse>(transactionsUrl)
      .then(response => response.data)
  }

  fetchEventsByAddress = (smartAddress: string) =>
    this.axiosInstance.get(`/address/${smartAddress}/events`)

  private async retryPromise<T>(promise: Promise<T>, nthTry: number = 1) : Promise<T> {
    try {
      const data = await promise
      return data
    } catch (e) {
      if (nthTry === 1) {
        return Promise.reject(e)
      }
      return this.retryPromise(promise, nthTry - 1)
    }
  }

  fetchTokensByAddress = async (address: string): Promise<ITokenWithBalance[]> => {
    const promise = this.axiosInstance.get<ITokenWithBalance[]>(`/address/${address.toLowerCase()}/tokens`)
    const response = await this.retryPromise(promise, 2)
    return response.data
  }

  fetchBalancesTransactionsPricesByAddress = async ({ address, prev, next, blockNumber = '0', limit }: SearchAddressDetailsFunction) => {
    const addressLowerCase = address.toLowerCase()
    const url = `/address/${addressLowerCase}`
    const promise = this.axiosInstance.get<AddressDetailsResponse>(url, { params: { prev, next, blockNumber, limit } })
    const response = await this.retryPromise(promise, 2)
    return response.data
  }

  fetchDapps = (): Promise<IRegisteredDappsGroup[]> =>
    this.axiosInstance
      .get<IRegisteredDappsGroup[]>('/dapps')
      .then(response => response.data)

  fetchXpubBalance = (xpub: string): Promise<IXPubBalanceData> =>
    this.axiosInstance
      .get<IXPubBalanceData>(`/bitcoin/getXpubBalance/${xpub}`)
      .then(response => response.data)

  fetchUtxos = (xpub: string): Promise<Array<UnspentTransactionType>> =>
    this.axiosInstance
      .get<Array<UnspentTransactionType>>(`/bitcoin/getXpubUtxos/${xpub}`)
      .then(res => res.data)

  sendTransactionHexData = (hexdata: string): Promise<any> =>
    this.axiosInstance
      .get(`/bitcoin/sendTransaction/${hexdata}`)
      .then(res => res.data)

  sendTransactionHexDataPost = (hexdata: string): Promise<any> =>
    this.axiosInstance
      .post('/bitcoin/sendTransaction', { txhexdata: hexdata })
      .then(res => res.data)

  fetchXpubNextUnusedIndex = (
    xpub: string,
    changeIndex = 0,
    knownLastUsedIndex = 0,
    maxIndexesToFetch = 5,
  ): Promise<{ index: number, availableIndexes: number[] }> =>
    this.axiosInstance
      .get(
        `/bitcoin/getNextUnusedIndex/${xpub}?changeIndex=${changeIndex}&knownLastUsedIndex=${knownLastUsedIndex}&maxIndexesToFetch=${maxIndexesToFetch}`,
      )
      .then(response => response.data)

  fetchXpubTransactions = (
    xpub: string,
    pageSize: number | undefined = undefined,
    pageNumber = 1,
  ): Promise<BitcoinTransactionContainerType> =>
    this.axiosInstance
      .get<BitcoinTransactionContainerType>(
        `/bitcoin/getXpubTransactions/${xpub}?pageSize=${pageSize}&page=${pageNumber}`,
      )
      .then(response => response.data)

  fetchBitcoinMiningFeeRates = <T extends 'blockbook' | 'cypher'>(apiSource: T = 'blockbook' as T, numberOfBlocks = 6): Promise<FetchBitcoinMiningFeeRatesReturnType<T>> =>
    this.axiosInstance
      .get<FetchBitcoinMiningFeeRatesReturnType<T>>(`/bitcoin/estimateFee?apiSource=${apiSource}&numberOfBlocks=${numberOfBlocks}`)
      .then(response => response.data)
}
