import { Account } from '../src/Account'
import { private_key_testnet_0, private_key_testnet_1, address_testnet_0, address_testnet_1, message, sig_testnet_0 } from './test-case'

describe('Wallet', () => {
  describe('info', () => {
    test('has an address', () => {
      const account = new Account({ privateKey: private_key_testnet_0 })
      expect(account.address).toEqual(address_testnet_0)
    })

    test('creates the correct address', () => {
      const account = new Account({ privateKey: private_key_testnet_1 })
      expect(account.address).toEqual(address_testnet_1)
    })
  })

  describe('proxy methods', function (this: {
    account: Account
  }) {
    beforeAll(() => {
      this.account = new Account({ privateKey: private_key_testnet_0 })
    })

    test('returns account', async () => {
      expect(await this.account.getAddress()).toEqual(address_testnet_0)
    })

    test('signs messages', async () => {
      expect(await this.account.signMessage(message)).toEqual(sig_testnet_0)
    })

    test('cannot change provider', () => {
      expect(() => this.account.connect({} as any)).toThrow()
    })
  })
})
