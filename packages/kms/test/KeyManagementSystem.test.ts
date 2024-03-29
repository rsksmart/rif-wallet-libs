import { Wallet } from 'ethers'
import { KeyManagementSystem, SaveableWallet } from '../src/KeyManagementSystem'
import * as testCase from './testCase'

describe('KeyManagementSystem', () => {
  describe('creation', () => {
    test('12 words mnemonic', () => {
      const kms = KeyManagementSystem.create()

      expect(kms.mnemonic.split(' ')).toHaveLength(12)
    })

    test('generates different mnemonics', () => {
      const kms = KeyManagementSystem.create()
      const kms2 = KeyManagementSystem.create()

      expect(kms.mnemonic).not.toEqual(kms2.mnemonic)
    })
  })

  describe('importing', () => {
    const kms = KeyManagementSystem.import(testCase.mnemonic)

    expect(kms.mnemonic).toEqual(testCase.mnemonic)
  })

  describe('account derivation', function (this: {
    kms: KeyManagementSystem
  }) {
    beforeEach(() => {
      this.kms = KeyManagementSystem.import(testCase.mnemonic)
    })

    describe('accounts by chain', () => {
      test('derives the first account', () => {
        const { wallet } = this.kms.nextWallet(31)

        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_0)
      })

      test('does not remember if not saved', () => {
        this.kms.nextWallet(31)
        const wallet2 = this.kms.nextWallet(31).wallet

        expect(wallet2.address.toLowerCase()).toEqual(testCase.address_testnet_0)
      })

      test('derives the next account', () => {
        const { save } = this.kms.nextWallet(31)
        save()

        const { wallet } = this.kms.nextWallet(31)

        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
      })

      test('derives for different networks', () => {
        const savebleTestnet0 = this.kms.nextWallet(31)
        savebleTestnet0.save()

        const savebleTestnet1 = this.kms.nextWallet(31)
        savebleTestnet1.save()

        const savebleMainnet0 = this.kms.nextWallet(30)
        savebleMainnet0.save()

        const savebleMainnet1 = this.kms.nextWallet(30)
        savebleMainnet1.save()

        expect(savebleTestnet0.wallet.address.toLowerCase()).toEqual(testCase.address_testnet_0)
        expect(savebleTestnet1.wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
        expect(savebleMainnet0.wallet.address.toLowerCase()).toEqual(testCase.address_mainnet_0)
        expect(savebleMainnet1.wallet.address.toLowerCase()).toEqual(testCase.address_mainnet_1)
      })
    })

    describe('removing derived paths', () => {
      test('cannot remove an inexistent wallet', () => {
        expect(() => this.kms.removeWallet(testCase.custom_account_dpath)).toThrow()
      })

      test('continues with next wallet when removed', () => {
        const { save, derivationPath } = this.kms.nextWallet(31)
        save()

        this.kms.removeWallet(derivationPath)

        const { wallet } = this.kms.nextWallet(31)

        expect(wallet.address.toLowerCase()).toEqual(testCase.address_testnet_1)
      })
    })

    describe('arbitrary derivation paths', () => {
      test('can derive any path', () => {
        const { wallet } = this.kms.addWallet(testCase.custom_account_dpath)

        expect(wallet.address.toLowerCase()).toEqual(testCase.custom_account_address)
      })

      test('avoids chain derivation if it was added as custom', () => {
        const { derivationPath } = this.kms.nextWallet(31) // not saved

        this.kms.addWallet(derivationPath).save()

        const { wallet } = this.kms.nextWallet(31)

        expect(wallet.address.toLocaleLowerCase()).toEqual(testCase.address_testnet_1)
      })

      test('avoids chain derivation for many manually added accounts', () => {
        const { derivationPath } = this.kms.nextWallet(31) // not saved

        this.kms.addWallet(derivationPath).save()
        this.kms.addWallet(derivationPath.slice(0, -1) + '1').save()

        const { wallet } = this.kms.nextWallet(31)

        expect(wallet.address.toLocaleLowerCase()).toEqual(testCase.address_testnet_2)
      })

      test('cannot an existent wallet', () => {
        this.kms.addWallet(testCase.custom_account_dpath).save()

        expect(() => this.kms.addWallet(testCase.custom_account_dpath)).toThrow()
      })
    })
  })

  describe('serialization', function (this: {
    kms: KeyManagementSystem
    addWallet: (saveableWallet: SaveableWallet) => void
    removeWallet: (saveableWallet: SaveableWallet) => void
    wallets: Wallet[]
  }) {
    beforeEach(() => {
      this.kms = KeyManagementSystem.create()
      this.wallets = []
      this.addWallet = (saveableWallet: SaveableWallet) => {
        this.wallets.push(saveableWallet.wallet)
        saveableWallet.save()
      }
      this.removeWallet = (saveableWallet: SaveableWallet) => {
        this.wallets = this.wallets.filter(wallet => wallet.address !== saveableWallet.wallet.address)
        this.kms.removeWallet(saveableWallet.derivationPath)
      }
    })

    afterEach(() => {
      const serialization = this.kms.serialize()
      const { kms, wallets } = KeyManagementSystem.fromSerialized(serialization)

      expect(kms.mnemonic).toEqual(this.kms.mnemonic)
      expect(kms.state).toEqual(this.kms.state)

      for (const wallet of wallets) {
        expect(this.wallets.find(w => w.address === wallet.address)).toBeDefined()
      }

      expect(wallets.length).toEqual(this.wallets.length)
    })

    test('emtpy', () => {
      // nothing
    })

    test('with one account', () => {
      this.addWallet(this.kms.nextWallet(31))
    })

    test('with many accounts', () => {
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(31))
    })

    test('with many accounts and networks', () => {
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(30))
      this.addWallet(this.kms.nextWallet(30))
    })

    test('with many accounts, networks, and custom wallets', () => {
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(30))
      this.addWallet(this.kms.nextWallet(30))
      this.addWallet(this.kms.addWallet(testCase.custom_account_dpath))
    })

    test('with many accounts, networks, custom wallets, and removing', () => {
      const saveableWallet = this.kms.nextWallet(31)
      this.addWallet(saveableWallet)
      this.addWallet(this.kms.nextWallet(31))
      this.addWallet(this.kms.nextWallet(30))
      this.addWallet(this.kms.nextWallet(30))
      this.addWallet(this.kms.addWallet(testCase.custom_account_dpath))
      this.removeWallet(saveableWallet)
    })
  })
})
