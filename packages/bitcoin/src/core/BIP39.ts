import { mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'

export class BIP39 {
  mnemonic: string
  seed!: Buffer
  constructor (mnemonic: string) {
    this.mnemonic = mnemonic
    this.setSeed()
  }

  setSeed () {
    this.seed = mnemonicToSeedSync(this.mnemonic)
  }
}
