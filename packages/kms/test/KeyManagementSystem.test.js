'use strict'
const __createBinding = (this && this.__createBinding) || (Object.create
  ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k] } })
  }
  : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k
    o[k2] = m[k]
  })
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
  ? function (o, v) {
    Object.defineProperty(o, 'default', { enumerable: true, value: v })
  }
  : function (o, v) {
    o.default = v
  })
const __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod
  const result = {}
  if (mod != null) for (const k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
  __setModuleDefault(result, mod)
  return result
}
Object.defineProperty(exports, '__esModule', { value: true })
const KeyManagementSystem_1 = require('../src/KeyManagementSystem')
const testCase = __importStar(require('./testCase'))
describe('KeyManagementSystem', function () {
  describe('creation', function () {
    test('24 words mnemonic', function () {
      const kms = KeyManagementSystem_1.KeyManagementSystem.create()
      expect(kms.mnemonic.split(' ')).toHaveLength(24)
    })
    test('generates different mnemonics', function () {
      const kms = KeyManagementSystem_1.KeyManagementSystem.create()
      const kms2 = KeyManagementSystem_1.KeyManagementSystem.create()
      expect(kms.mnemonic).not.toEqual(kms2.mnemonic)
    })
  })
  describe('importing', function () {
    const kms = KeyManagementSystem_1.KeyManagementSystem.import(testCase.mnemonic)
    expect(kms.mnemonic).toEqual(testCase.mnemonic)
  })
  describe('account derivation', function () {
    const _this = this
    beforeEach(function () {
      _this.kms = KeyManagementSystem_1.KeyManagementSystem.import(testCase.mnemonic)
    })
    describe('accounts by chain', function () {
      test('derives the first account', function () {
        const wallet = _this.kms.nextWallet(31).wallet
        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_0)
      })
      test('does not remember if not saved', function () {
        _this.kms.nextWallet(31)
        const wallet2 = _this.kms.nextWallet(31).wallet
        expect(wallet2.address.toLowerCase()).toEqual(testCase.address_testnet_0)
      })
      test('derives the next account', function () {
        const save = _this.kms.nextWallet(31).save
        save()
        const wallet = _this.kms.nextWallet(31).wallet
        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
      })
      test('derives for different networks', function () {
        const savebleTestnet0 = _this.kms.nextWallet(31)
        savebleTestnet0.save()
        const savebleTestnet1 = _this.kms.nextWallet(31)
        savebleTestnet1.save()
        const savebleMainnet0 = _this.kms.nextWallet(30)
        savebleMainnet0.save()
        const savebleMainnet1 = _this.kms.nextWallet(30)
        savebleMainnet1.save()
        expect(savebleTestnet0.wallet.address.toLowerCase()).toEqual(testCase.address_testnet_0)
        expect(savebleTestnet1.wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
        expect(savebleMainnet0.wallet.address.toLowerCase()).toEqual(testCase.address_mainnet_0)
        expect(savebleMainnet1.wallet.address.toLowerCase()).toEqual(testCase.address_mainnet_1)
      })
    })
    describe('removing derived paths', function () {
      test('cannot remove an inexistent wallet', function () {
        expect(function () { return _this.kms.removeWallet(testCase.custom_account_dpath) }).toThrow()
      })
      test('continues with next wallet when removed', function () {
        const _a = _this.kms.nextWallet(31); const save = _a.save; const derivationPath = _a.derivationPath
        save()
        _this.kms.removeWallet(derivationPath)
        const wallet = _this.kms.nextWallet(31).wallet
        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
      })
    })
    describe('arbitrary derivation paths', function () {
      test('can derive any path', function () {
        const wallet = _this.kms.addWallet(testCase.custom_account_dpath).wallet
        expect(wallet.address.toLowerCase()).toEqual(testCase.custom_account_address)
      })
      test('avoids chain derivation if it was added as custom', function () {
        const derivationPath = _this.kms.nextWallet(31).derivationPath // not saved
        _this.kms.addWallet(derivationPath).save()
        const wallet = _this.kms.nextWallet(31).wallet
        expect(wallet.address.toLocaleLowerCase()).toEqual(testCase.address_testnet_1)
      })
      test('avoids chain derivation for many manually added accounts', function () {
        const derivationPath = _this.kms.nextWallet(31).derivationPath // not saved
        _this.kms.addWallet(derivationPath).save()
        _this.kms.addWallet(derivationPath.slice(0, -1) + '1').save()
        const wallet = _this.kms.nextWallet(31).wallet
        expect(wallet.address.toLocaleLowerCase()).toEqual(testCase.address_testnet_2)
      })
      test('cannot an existent wallet', function () {
        _this.kms.addWallet(testCase.custom_account_dpath).save()
        expect(function () { return _this.kms.addWallet(testCase.custom_account_dpath) }).toThrow()
      })
    })
  })
  describe('serialization', function () {
    const _this = this
    beforeEach(function () {
      _this.kms = KeyManagementSystem_1.KeyManagementSystem.create()
      _this.wallets = []
      _this.addWallet = function (saveableWallet) {
        _this.wallets.push(saveableWallet.wallet)
        saveableWallet.save()
      }
      _this.removeWallet = function (saveableWallet) {
        _this.wallets = _this.wallets.filter(function (wallet) { return wallet.address !== saveableWallet.wallet.address })
        _this.kms.removeWallet(saveableWallet.derivationPath)
      }
    })
    afterEach(function () {
      const serialization = _this.kms.serialize()
      const _a = KeyManagementSystem_1.KeyManagementSystem.fromSerialized(serialization); const kms = _a.kms; const wallets = _a.wallets
      expect(kms.mnemonic).toEqual(_this.kms.mnemonic)
      expect(kms.state).toEqual(_this.kms.state)
      const _loop_1 = function (wallet) {
        expect(_this.wallets.find(function (w) { return w.address === wallet.address })).toBeDefined()
      }
      for (let _i = 0, wallets_1 = wallets; _i < wallets_1.length; _i++) {
        const wallet = wallets_1[_i]
        _loop_1(wallet)
      }
      expect(wallets.length).toEqual(_this.wallets.length)
    })
    test('emtpy', function () {
      // nothing
    })
    test('with one account', function () {
      _this.addWallet(_this.kms.nextWallet(31))
    })
    test('with many accounts', function () {
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(31))
    })
    test('with many accounts and networks', function () {
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(30))
      _this.addWallet(_this.kms.nextWallet(30))
    })
    test('with many accounts, networks, and custom wallets', function () {
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(30))
      _this.addWallet(_this.kms.nextWallet(30))
      _this.addWallet(_this.kms.addWallet(testCase.custom_account_dpath))
    })
    test('with many accounts, networks, custom wallets, and removing', function () {
      const saveableWallet = _this.kms.nextWallet(31)
      _this.addWallet(saveableWallet)
      _this.addWallet(_this.kms.nextWallet(31))
      _this.addWallet(_this.kms.nextWallet(30))
      _this.addWallet(_this.kms.nextWallet(30))
      _this.addWallet(_this.kms.addWallet(testCase.custom_account_dpath))
      _this.removeWallet(saveableWallet)
    })
  })
})
