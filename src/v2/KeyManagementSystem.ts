import { Wallet } from 'ethers'
import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import { fromSeed } from 'bip32' // TOD): add method to @rsksmart/rif-id-mnemonic

type Mnemonic = string

type DerivedPaths = { [derivatoinPath: string]: boolean }

type LastDerivedAccountIndex = {
  [chainId: number]: number
}

type KeyManagementSystemState = {
  lastDerivedAccountIndex: LastDerivedAccountIndex
  derivedPaths: DerivedPaths
}

const createInitialState = (): KeyManagementSystemState => ({
  lastDerivedAccountIndex: {},
  derivedPaths: {}
})

type KeyManagemenetSystemSerialization = {
  mnemonic: Mnemonic
  state: KeyManagementSystemState
}

type SaveableWallet = {
  derivationPath: string
  wallet: Wallet
  save(): void
}

interface IKeyManagementSystem {
  nextWallet (chainId: number): SaveableWallet
  addWallet (derivationPath: string): SaveableWallet
  removeWallet (derivationPath: string): void
}

export class KeyManagementSystem implements IKeyManagementSystem {
  state: KeyManagementSystemState
  mnemonic: Mnemonic

  private constructor (mnemonic: Mnemonic, initialState: KeyManagementSystemState) {
    this.mnemonic = mnemonic
    this.state = initialState
  }

  /**
   * Factory method: generates a mnemonic and initializes the
   * Key Management System
   * @returns a new Key Management System with a new mnemonic
   */
   static create (): KeyManagementSystem {
    const mnemonic = generateMnemonic(24)
    return new KeyManagementSystem(mnemonic, createInitialState())
  }

  /**
   * Factory method: use this method to import a wallet and the
   * used derivation paths
   * @param mnemonic a mnemonic phrase
   * @param state the state of the Key Management System
   * @returns A Key Management System with the given mnemonic and state
   */
  static import (mnemonic: Mnemonic) {
    return new KeyManagementSystem(mnemonic, createInitialState())
  }

  /**
   * Use this method to recover a stored serialized wallet
   * @param serialized the serialized string
   * @returns the KeyManagementSystem that was serialized
   */
  static fromSerialized (serialized: string): KeyManagementSystem {
    const { mnemonic, state }: KeyManagemenetSystemSerialization = JSON.parse(serialized)
    return new KeyManagementSystem(mnemonic, state)
  }

  /**
   * Use this method to get a string to be stored and recovered
   * @returns a serialized wallet
   */
  serialize (): string {
    const serialization: KeyManagemenetSystemSerialization = {
      mnemonic: this.mnemonic,
      state: this.state
    }

    return JSON.stringify(serialization)
  }

  private deriveWallet (derivationPath: string) {
    // Create the seed - ref: BIP-39
    const seed = mnemonicToSeedSync(this.mnemonic)
    const hdKey = fromSeed(seed).derivePath(derivationPath)
    const privateKey = hdKey.privateKey!.toString('hex')
    return new Wallet(privateKey)
  }

  /**
   * Get the derived Wallet for a network given an index. It will pick the base derivation
   * path given the chain id and index the address based on BIP-44
   * @param chainId EIP-155 chain Id
   * @returns An ethers Wallet with the private key derived for the given index in
   * the given network
   */
  nextWallet (chainId: number): SaveableWallet {
    // Get the next derivation path for the address - ref: BIP-44
    if (!this.state.lastDerivedAccountIndex[chainId]) {
      this.state.lastDerivedAccountIndex[chainId] = 0
    }

    let derivationPath = getDPathByChainId(chainId, this.state.lastDerivedAccountIndex[chainId])

    while (this.state.derivedPaths[derivationPath]) {
      this.state.lastDerivedAccountIndex[chainId]++
      derivationPath = getDPathByChainId(chainId, this.state.lastDerivedAccountIndex[chainId])
    }

    const wallet = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = true
        this.state.lastDerivedAccountIndex[chainId] = this.state.lastDerivedAccountIndex[chainId] + 1
      }
    }
  }

  addWallet (derivationPath: string): SaveableWallet {
    if (this.state.derivedPaths[derivationPath]) throw new Error('Existent wallet')

    const wallet = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = true
      }
    }
  }

  removeWallet (derivationPath: string): void {
    if (!this.state.derivedPaths[derivationPath]) throw new Error('Inexistent wallet')

    this.state.derivedPaths[derivationPath] = false
  }
}
