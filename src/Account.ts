import { Wallet, Signer, Bytes } from 'ethers'
import { Provider, TransactionRequest } from "@ethersproject/abstract-provider"

export class Account extends Signer {
  wallet: Wallet

  get privateKey() {
    return this.wallet.privateKey
  }

  get address() {
    return this.wallet.address.toLowerCase()
  }

  constructor({ privateKey }: { privateKey: string }) {
    super()
    this.wallet = new Wallet(privateKey)
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  signMessage(message: Bytes | string): Promise<string> {
    // this method is used only for direct signing messages
    // ethers.js is not using this method in contracts or transactions
    // we can proxy to the wallet and build the ux on top of it
    return this.wallet.signMessage(message)
  }

  // Signs a transaxction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  signTransaction(transaction: TransactionRequest): Promise<string> {
    throw new Error()
    // here we queue the transaction
    // we should now wait for its semaphore
    // ux happens here
    // const signedTransaction = this.wallet.signTransaction(transaction)
    // remove from queue
    // release locks
    // return signedTransaction
  }

  // Returns a new instance of the Signer, connected to provider.
  // This MAY throw if changing providers is not supported.
  connect(provider: Provider): Signer { throw new Error() }
}
