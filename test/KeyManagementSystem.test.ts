import { KeyManagementSystem } from '../src/v2/KeyManagementSystem'
import { mnemonic, private_key_testnet_0, private_key_testnet_1, private_key_mainnet_0 } from './test-case'

describe('KeyManagementSystem', () => {
  test('derives private keys given a mneomnic', () => {
    const kms = new KeyManagementSystem({ mnemonic })

    const wallet0 = kms.deriveWallet(31, 0)
    const wallet1 = kms.deriveWallet(31, 1)
    const walletMainnet0 = kms.deriveWallet(30, 0)

    expect(wallet0.privateKey).toEqual(private_key_testnet_0)
    expect(wallet1.privateKey).toEqual(private_key_testnet_1)
    expect(walletMainnet0.privateKey).toEqual(private_key_mainnet_0)
  })

  test('creates new mnemonics', () => {
    const kms0 = KeyManagementSystem.create()
    const kms1 = KeyManagementSystem.create()

    expect(kms0.mnemonic).not.toEqual(kms1.mnemonic)
  })
})
