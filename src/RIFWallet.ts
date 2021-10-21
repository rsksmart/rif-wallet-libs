import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider'
import { Bytes, Signer, Wallet } from 'ethers'
import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'
import { defineReadOnly } from '@ethersproject/properties'

const filterTxOptions = (transactionRequest: TransactionRequest) => Object.keys(transactionRequest)
  .filter(key => !['from', 'to', 'data'].includes(key))
  .reduce((obj: any, key: any) => {
    obj[key] = (transactionRequest as any)[key]
    return obj
  }, {})

export type Request = {
  type: 'sendTransaction'
  payload: {
    // needs refactor: payload can be transactionRequest, not an object of transactionRequest
    transactionRequest: TransactionRequest
  }
  confirm: (value?: any) => void
  reject: (reason?: any) => void
}

export type OnRequest = (request: Request) => void

export class RIFWallet extends Signer {
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  onRequest: OnRequest

  private constructor (smartWalletFactory: SmartWalletFactory, smartWallet: SmartWallet, onRequest: OnRequest) {
    super()
    this.smartWalletFactory = smartWalletFactory
    this.smartWallet = smartWallet
    this.onRequest = onRequest

    defineReadOnly(this, 'provider', this.smartWallet.wallet.provider) // ref: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-signer/src.ts/index.ts#L130
  }

  get address (): string {
    return this.smartWallet.smartWalletAddress
  }

  get smartWalletAddress (): string {
    return this.smartWallet.smartWalletAddress
  }

  get wallet (): Wallet {
    return this.smartWallet.wallet
  }

  static async create (wallet: Wallet, smartWalletFactoryAddress: string, onRequest: OnRequest) {
    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryAddress)
    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const smartWallet = SmartWallet.create(wallet, smartWalletAddress)
    return new RIFWallet(smartWalletFactory, smartWallet, onRequest)
  }

  getAddress = (): Promise<string> => Promise.resolve(this.smartWallet.smartWalletAddress)

  signMessage = (message: string | Bytes): Promise<string> => this.smartWallet.wallet.signMessage(message)
  signTransaction = (transaction: TransactionRequest): Promise<string> => this.smartWallet.wallet.signTransaction(transaction)

  // calls via smart wallet
  call (transactionRequest: TransactionRequest, blockTag?: BlockTag): Promise<any> {
    return this.smartWallet.callStaticDirectExecute(transactionRequest.to!, transactionRequest.data!, { ...filterTxOptions(transactionRequest), blockTag })
  }

  async sendTransaction (transactionRequest: TransactionRequest): Promise<TransactionResponse> {
    // waits for confirm()
    await new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<Request>({
        type: 'sendTransaction',
        payload: {
          transactionRequest
        },
        confirm: () => {
          resolve(undefined)
        },
        reject: (reason?: any) => {
          reject(new Error(reason))
        }
      })

      // emits onRequest with reference to the transactionRequest
      this.onRequest(nextRequest)
    })

    // sends via smart wallet
    return await this.smartWallet.directExecute(transactionRequest.to!, transactionRequest.data!, filterTxOptions(transactionRequest))
  }

  connect = (provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
