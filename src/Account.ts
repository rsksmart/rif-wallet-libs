import { Wallet } from 'ethers'

export class Account {
  wallet: Wallet

  get privateKey() {
    return this.wallet.privateKey
  }

  get address() {
    return this.wallet.address
  }

  constructor({ privateKey }: { privateKey: string }) {
    this.wallet = new Wallet(privateKey)
  }
}
