import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import { fromSeed } from 'bip32' // TOD): add method to @rsksmart/rif-id-mnemonic
import { Provider } from '@ethersproject/abstract-provider'
import { Account } from './Account'

type Providers = { [key: number]: Provider }

export class Wallet {
  mnemonic: string
  providers: Providers

  constructor ({ mnemonic, providers }: {
    mnemonic: string
    providers: Providers
  }) {
    this.mnemonic = mnemonic
    this.providers = providers
  }

  static create (providers: Providers): Wallet {
    const mnemonic = generateMnemonic(24)
    const wallet = new Wallet({ mnemonic, providers })
    return wallet
  }

  getAccount (chainId: number, index: number) {
    const seed = mnemonicToSeedSync(this.mnemonic)
    const dpath = getDPathByChainId(chainId) || "m/44'/60'/0'/0/0"
    const hdKey = fromSeed(seed).derivePath(dpath.slice(0, dpath.length - 2))
    const privateKey = hdKey.derive(index).privateKey!.toString('hex')
    const provider = this.providers[chainId]
    return new Account({ privateKey, provider })
  }
}
