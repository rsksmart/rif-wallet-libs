import { Network, payments } from 'bitcoinjs-lib'

export class AddressFactory {
  purpose: string | number
  network: Network

  constructor (purpose = 84, network: Network) {
    this.purpose = purpose
    this.network = network
  }

  getAddress (publicKey: Buffer): string {
    switch (this.purpose) {
      case 84:
        return payments.p2wpkh({
          network: this.network,
          pubkey: publicKey
        }).address as string
      case 44:
        return payments.p2pkh({
          network: this.network,
          pubkey: publicKey
        }).address as string
      default:
        throw new Error(`Not implemented ${this.purpose}`)
    }
  }
}
