'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KeyManagementSystem = void 0
const ethers_1 = require('ethers')
const rif_id_mnemonic_1 = require('@rsksmart/rif-id-mnemonic')
const rlogin_dpath_1 = require('@rsksmart/rlogin-dpath')
const createInitialState = function () {
  return ({
    lastDerivedAccountIndex: {},
    derivedPaths: {}
  })
}
/**
 * The Key Management System will derive accounts for a given mnemonic. It allows
 * two type of derivations:
 * - By chain id (nextWallet): it will use an incremental account_index based on BIP-44
 * - Arbitrary derivation paths (addWallet): it will derive the account for the given
 *   path, affecting the accounts by chain id. If an account of a chain is
 *   added, it will be skiped when adding by chain id
 * Both methods will return a { derivationPath, wallet, save } object that can be used
 * to deffer saving the account in the KMS. This can be used to show the user the account
 * before storing it.
 * Use removeWallet to remove it from the KMS. It can be added back by adding as and
 * arbitrary accounts
 * Use serialize/fromSerialized to store the KMS
 */
const KeyManagementSystem = /** @class */ (function () {
  function KeyManagementSystem (mnemonic, initialState) {
    this.mnemonic = mnemonic
    this.state = initialState
  }
  /**
     * Factory method: generates a mnemonic and initializes the
     * Key Management System
     * @returns a new Key Management System with a new mnemonic
     */
  KeyManagementSystem.create = function () {
    const mnemonic = (0, rif_id_mnemonic_1.generateMnemonic)(24)
    return new KeyManagementSystem(mnemonic, createInitialState())
  }
  /**
     * Factory method: use this method to import a wallet and the
     * used derivation paths
     * @param mnemonic a mnemonic phrase
     * @param state the state of the Key Management System
     * @returns A Key Management System with the given mnemonic and state
     */
  KeyManagementSystem.import = function (mnemonic) {
    return new KeyManagementSystem(mnemonic, createInitialState())
  }
  /**
     * Use this method to recover a stored serialized wallet
     * @param serialized the serialized string
     * @returns the KeyManagementSystem that was serialized
     */
  KeyManagementSystem.fromSerialized = function (serialized) {
    const _a = JSON.parse(serialized); const mnemonic = _a.mnemonic; const state = _a.state
    const kms = new KeyManagementSystem(mnemonic, state)
    const wallets = Object.keys(state.derivedPaths)
      .filter(function (derivedPath) { return state.derivedPaths[derivedPath] })
      .map(function (derivedPath) { return kms.deriveWallet(derivedPath) })
    return {
      kms: kms,
      wallets: wallets
    }
  }
  /**
     * Use this method to get a string to be stored and recovered
     * @returns a serialized wallet
     */
  KeyManagementSystem.prototype.serialize = function () {
    const serialization = {
      mnemonic: this.mnemonic,
      state: this.state
    }
    return JSON.stringify(serialization)
  }
  KeyManagementSystem.prototype.deriveWallet = function (derivationPath) {
    // Create the seed - ref: BIP-39
    const seed = (0, rif_id_mnemonic_1.mnemonicToSeedSync)(this.mnemonic)
    const hdKey = (0, rif_id_mnemonic_1.fromSeed)(seed).derivePath(derivationPath)
    const privateKey = hdKey.privateKey.toString('hex')
    return new ethers_1.Wallet(privateKey)
  }
  /**
     * Get the next wallet for the given chainId
     * @param chainId EIP-155 chain Id
     * @returns a savable account
     */
  KeyManagementSystem.prototype.nextWallet = function (chainId) {
    const _this = this
    // Get the next derivation path for the address - ref: BIP-44
    if (!this.state.lastDerivedAccountIndex[chainId]) {
      this.state.lastDerivedAccountIndex[chainId] = 0
    }
    let derivationPath = (0, rlogin_dpath_1.getDPathByChainId)(chainId, this.state.lastDerivedAccountIndex[chainId])
    while (this.state.derivedPaths[derivationPath]) {
      this.state.lastDerivedAccountIndex[chainId]++
      derivationPath = (0, rlogin_dpath_1.getDPathByChainId)(chainId, this.state.lastDerivedAccountIndex[chainId])
    }
    const wallet = this.deriveWallet(derivationPath)
    return {
      derivationPath: derivationPath,
      wallet: wallet,
      save: function () {
        _this.state.derivedPaths[derivationPath] = true
        _this.state.lastDerivedAccountIndex[chainId] = _this.state.lastDerivedAccountIndex[chainId] + 1
      }
    }
  }
  /**
     * Get tehe account for an arbitrary derivation path
     * @param derivationPath an arbitrary derivation path
     * @returns a savable wallet
     */
  KeyManagementSystem.prototype.addWallet = function (derivationPath) {
    const _this = this
    if (this.state.derivedPaths[derivationPath]) { throw new Error('Existent wallet') }
    const wallet = this.deriveWallet(derivationPath)
    return {
      derivationPath: derivationPath,
      wallet: wallet,
      save: function () {
        _this.state.derivedPaths[derivationPath] = true
      }
    }
  }
  /**
     * Remove a wallet from the Key Management System
     * @param derivationPath the derivation path of the wallet to be removed
     */
  KeyManagementSystem.prototype.removeWallet = function (derivationPath) {
    if (!this.state.derivedPaths[derivationPath]) { throw new Error('Inexistent wallet') }
    delete this.state.derivedPaths[derivationPath]
  }
  return KeyManagementSystem
}())
exports.KeyManagementSystem = KeyManagementSystem
