import {
  IRegisteredDappsGroup,
  ITokenWithBalance, IXPubBalanceData,
  onSetInternetCredentials, RifWalletFetcherDependencies, RIFWalletServicesFetcherInterface,
  TransactionsServerResponse,
} from './types'
import { BitcoinTransactionContainerType, UnspentTransactionType } from '@rsksmart/rif-wallet-bitcoin'
import axios, { AxiosInstance } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export class RifWalletServicesFetcher<Options, onSetInternetCredentialsReturn> implements RIFWalletServicesFetcherInterface {
  axiosInstance: AxiosInstance
  accessToken = ''
  refreshToken = ''
  onSetInternetCredentials: onSetInternetCredentials<Options, onSetInternetCredentialsReturn>
  defaultChainId: string
  resultsLimit: number
  constructor(
    axiosInstance: AxiosInstance,
    accessToken: string,
    refreshToken: string,
    dependencies: RifWalletFetcherDependencies<Options, onSetInternetCredentialsReturn>
  ) {
    this.axiosInstance = axiosInstance
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    // Dependencies injection
    this.onSetInternetCredentials = dependencies.onSetInternetCredentials
    this.defaultChainId = dependencies.defaultChainId
    this.resultsLimit = dependencies.resultsLimit || 10
    this.axiosInstance.interceptors.request.use(
      config => {
        if (!config.headers?.Authorization) {
          config.headers!.Authorization = `DIDAuth ${this.getAccessToken()}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    this.axiosInstance.interceptors.request.use(
      config => {
        config.params = { ...config.params, chainId: this.defaultChainId }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    const refreshAuthLogic = async (failedRequest: any) => {
      const data = {
        refreshToken: this.getRefreshToken(),
      }
      const options = {
        method: 'POST',
        data,
        url: `${this.axiosInstance.getUri()}/refresh-token`,
      }

      try {
        const {
          data: {
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          },
        } = await axios(options)
        failedRequest.response.config.headers.Authorization =
          'DIDAuth ' + currentAccessToken

        await this.onSetInternetCredentials(
          'jwt',
          'token',
          JSON.stringify({
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          }),
        )
        this.accessToken = currentAccessToken
        this.refreshToken = currentRefreshToken
        return await Promise.resolve()
      } catch (e) {}
    }

    createAuthRefreshInterceptor(this.axiosInstance, refreshAuthLogic, {
      shouldRefresh: error => {
        return error.response?.status === 401
      },
    })
  }

  private getAccessToken = () => {
    return this.accessToken
  }

  private getRefreshToken = () => {
    return this.refreshToken
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

    fetchTokensByAddress = async (address: string): Promise<ITokenWithBalance[]> => {
      for (let i = 0; i < 2; i++) {
        try {
          const response = await this.axiosInstance
            .get<ITokenWithBalance[]>(`/address/${address.toLowerCase()}/tokens`)
          return response.data
        } catch { }
      }
      throw new Error('Please restart the app')
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

  fetchXpubNextUnusedIndex = (
    xpub: string,
    changeIndex = 0,
    knownLastUsedIndex = 0,
  ): Promise<number> =>
    this.axiosInstance
      .get(
        `/bitcoin/getNextUnusedIndex/${xpub}?changeIndex=${changeIndex}&knownLastUsedIndex=${knownLastUsedIndex}`,
      )
      .then(response => response.data)
      .then(json => json.index)

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
}
