import { Wallet } from '@ethersproject/wallet'
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
   * Get the derived Wallet for a network given an index. It will pick the base derivation
   * path given the chain id and index the address based on BIP-44
   * @param chainId EIP-155 chain Id
   * @param index use it to derive different accounts based on SLIP-44
   * @returns An ethers Wallet with the private key derived for the given index in
   * the given network
   */
  deriveWallet (chainId: number, index: number): Wallet {
    // Create the seed - ref: BIP-39
    const seed = mnemonicToSeedSync(this.mnemonic)

    // Get the derivation path for the address index - ref: BIP-44
    const dpath = getDPathByChainId(chainId, index)
    const hdKey = fromSeed(seed).derivePath(dpath)

    const privateKey = hdKey.privateKey!.toString('hex')

    return new Wallet(privateKey)
  }

  /**
   * Use this method to get a string to be stored and recovered
   * @returns a serialized wallet
   */
  serialize (): string {
    return JSON.stringify({ mnemonic: this.mnemonic })
  }

  /**
   * Use this method to recover a stored serialized wallet
   * @param serialized the serialized string
   * @returns the KeyManagementSystem that was serialized
   */
  static fromSerialized (serialized: string): KeyManagementSystem {
    return new KeyManagementSystem(JSON.parse(serialized))
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
}
