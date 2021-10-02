import { Wallet } from '../src/Wallet'
import { mnemonic, private_key_testnet_0, private_key_testnet_1 } from './test-case'

describe('RIFWallet', () => {
  describe('create a wallet', () => {
    test('wallets have a 24 word mneomnic', () => {
      const wallet = Wallet.create()
      expect(wallet.mnemonic.split(' ')).toHaveLength(24)
    })

    test('creates different wallets', () => {
      const wallet = Wallet.create()
      const anotherWallet = Wallet.create()
      expect(wallet.mnemonic).not.toEqual(anotherWallet.mnemonic)
    })
  })

  describe('import wallet', () => {
    test('imports a wallet given a mnemonic', () => {
      const wallet = new Wallet({ mnemonic })
      expect(wallet.mnemonic).toEqual(mnemonic)
    })
  })

  describe('derives accounts', () => {
    test('creates a private key for an account', () => {
      const wallet = new Wallet({ mnemonic })
      const account = wallet.getAccount(0)
      expect(account.privateKey).toEqual(private_key_testnet_0)
    })

    test('creates the tree of private keys', () => {
      const wallet = new Wallet({ mnemonic })
      const account = wallet.getAccount(1)
      expect(account.privateKey).toEqual(private_key_testnet_1)
    })
  })
})
