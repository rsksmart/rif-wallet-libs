import EventEmitter from 'events'
import { io, Socket } from 'socket.io-client'

import { IAbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RifWalletServicesFetcher } from './RifWalletServicesFetcher'

import {
  CacheInterface, EnhanceTransactionFunction,
  FilterOutRepeatedTransactionsFunction,
  Header,
  IApiTransaction,
  IRifWalletServicesSocket, IServiceChangeEvent, OnBeforeInitFunction,
  RifWalletSocketDependencies
} from './types'

export class RifWalletServicesSocket<Options, onSetInternetCredentialsReturn>
  extends EventEmitter
  implements IRifWalletServicesSocket {
  private rifWalletServicesUrl: string
  private abiEnhancer: IAbiEnhancer
  private socket: Socket | undefined
  onFilterOutRepeatedTransactions: FilterOutRepeatedTransactionsFunction
  onEnhanceTransaction: EnhanceTransactionFunction
  cache: CacheInterface
  cacheTexts = {
    cacheBlockNumberText: 'blockNumber',
    cacheTxsText: 'cachedTxs'
  }

  onBeforeInit: OnBeforeInitFunction<Options, onSetInternetCredentialsReturn>
  encryptionKeyMessageToSign: string
  constructor(rifWalletServicesUrl: string, abiEnhancer: IAbiEnhancer, dependencies: RifWalletSocketDependencies<Options, onSetInternetCredentialsReturn>, cacheTextOptions?: {
                cacheBlockNumberText: string
                cacheTxsText: string
              }
  ) {
    super()

    this.abiEnhancer = abiEnhancer
    this.rifWalletServicesUrl = rifWalletServicesUrl
    this.onFilterOutRepeatedTransactions = dependencies.onFilterOutRepeatedTransactions
    this.cache = dependencies.cache
    this.onBeforeInit = dependencies.onBeforeInit
    this.onEnhanceTransaction = dependencies.onEnhanceTransaction
    this.encryptionKeyMessageToSign = dependencies.encryptionKeyMessageToSign
    this.cacheTexts.cacheTxsText = cacheTextOptions?.cacheTxsText || this.cacheTexts.cacheTxsText
    this.cacheTexts.cacheBlockNumberText = cacheTextOptions?.cacheBlockNumberText || this.cacheTexts.cacheBlockNumberText
  }

  private async init(
    wallet: RIFWallet,
    encryptionKey: string,
    fetcher: RifWalletServicesFetcher,
  ) {
    this.onBeforeInit(encryptionKey, this)
    const { cacheBlockNumberText, cacheTxsText } = this.cacheTexts

    const blockNumber = this.cache.get(cacheBlockNumberText) || '0'
    const catchedTxs = this.cache.get(cacheTxsText) || []

    const fetchedTransactions = await fetcher.fetchTransactionsByAddress(
      wallet.smartWalletAddress,
      null,
      null,
      blockNumber,
    )

    let lastBlockNumber = blockNumber
    const activityTransactions = await Promise.all(
      fetchedTransactions.data.map(async (tx: IApiTransaction) => {
        if (parseInt(blockNumber, 10) < tx.blockNumber) {
          lastBlockNumber = tx.blockNumber
        }
        if (this.cache.has(tx.hash)) {
          return {
            originTransaction: tx,
            enhancedTransaction: this.cache.get(tx.hash),
          }
        }
        const enhancedTransaction = await this.onEnhanceTransaction(tx, wallet)
        if (enhancedTransaction) {
          this.cache.set(tx.hash, enhancedTransaction)
          return {
            originTransaction: tx,
            enhancedTransaction,
          }
        } else {
          return {
            originTransaction: tx,
            enhancedTransaction: undefined,
          }
        }
      }),
    )
    const transactions = catchedTxs
      .concat(activityTransactions)
      .filter(this.onFilterOutRepeatedTransactions)

    this.cache.set(cacheTxsText, transactions)
    this.cache.set(cacheBlockNumberText, lastBlockNumber.toString())

    const fetchedTokens = await fetcher?.fetchTokensByAddress(
      wallet.smartWalletAddress,
    )

    this.emit('init', {
      transactions: transactions,
      balances: fetchedTokens,
    })
  }

  async connect(wallet: RIFWallet, fetcher: RifWalletServicesFetcher, headers: Header) {
    try {
      const encriptionKey = await wallet.smartWallet.signer.signMessage(
        this.encryptionKeyMessageToSign,
      )
      await this.init(wallet, encriptionKey, fetcher)

      const socket = io(this.rifWalletServicesUrl, {
        path: '/ws',
        forceNew: true,
        reconnectionAttempts: 3,
        timeout: 2000,
        autoConnect: true,
        extraHeaders: headers,
        transports: ['websocket'], // you need to explicitly tell it to use websocket
      })

      socket.on('connect', () => {
        socket.on('change', (event: IServiceChangeEvent) => {
          this.emit('change', event)
        })

        socket.emit('subscribe', {
          address: wallet.smartWalletAddress,
        })
      })

      this.socket = socket
    } catch (error) {
      console.error('socket error', error)
      if (error instanceof Error) {
        throw new Error(error.toString())
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  isConnected() {
    if (!this.socket) {
      return false
    }

    return this.socket.connected
  }

  setCache(cache: CacheInterface) {
    this.cache = cache
    return cache
  }
}
