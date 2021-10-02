import { Account } from '../src/Account'
import { private_key_testnet_0, private_key_testnet_1, address_testnet_0, address_testnet_1 } from './test-case'

describe('Wallet', () => {
  test('has an address', () => {
    const account = new Account({ privateKey: private_key_testnet_0 })
    expect(account.address.toLowerCase()).toEqual(address_testnet_0)
  })

  test('creates the correct address', () => {
    const account = new Account({ privateKey: private_key_testnet_1 })
    expect(account.address.toLowerCase()).toEqual(address_testnet_1)
  })
})
