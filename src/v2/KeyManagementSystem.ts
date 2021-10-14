import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import { fromSeed } from 'bip32' // TOD): add method to @rsksmart/rif-id-mnemonic

export class KeyManagementSystem {
  mnemonic: string

  constructor ({ mnemonic }: {
    mnemonic: string
  }) {
    this.mnemonic = mnemonic
  }

  /**
   * Factory method: creates a mnemonic and initialized the
   * Key Management System
   * @returns a new Key Management System with a new mnemonic
   */
  static create (): KeyManagementSystem {
    const mnemonic = generateMnemonic(24)
    return new KeyManagementSystem({ mnemonic })
  }

  /**
   * Get the derived private key given an index. It will pick the base derivation
   * path given the chain id and index the address based on BIP-44
   * @param chainId EIP-155 chain Id
   * @param index use it to  derive different accounts based on SLIP-44
   * @returns the private key for the given index in the given network
   */
  derivePrivateKey (chainId: number, index: number) {
    // Create the seed - ref: BIP-39
    const seed = mnemonicToSeedSync(this.mnemonic)

    // Get the derivation path for the address index - ref: BIP-44
    const dpath = getDPathByChainId(chainId, index)
    const hdKey = fromSeed(seed).derivePath(dpath)

    return hdKey.privateKey!.toString('hex')
  }
}
