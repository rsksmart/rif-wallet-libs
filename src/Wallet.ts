import { generateMnemonic } from '@rsksmart/rif-id-mnemonic'

export class Wallet {
  mnemonic: string

  constructor({ mnemonic }: {
    mnemonic: string
  }) {
    this.mnemonic = mnemonic
  }

  static create(): Wallet {
    const mnemonic = generateMnemonic(24)
    const wallet = new Wallet({ mnemonic })
    return wallet
  }
}