import { KeyManagementSystem } from "./KeyManagementSystem"
import { mnemonic, private_key_testnet_0, private_key_testnet_1, private_key_mainnet_0 } from './test-case'

describe('KeyManagementSystem', () => {
  test('derives private keys given a mneomnic', () => {
    const kms = new KeyManagementSystem({ mnemonic })

    const privateKey0 = kms.derivePrivateKey(31, 0)
    const privateKey1 = kms.derivePrivateKey(31, 1)
    const privateKeyMainnet0 = kms.derivePrivateKey(30, 0)

    expect(privateKey0).toEqual(private_key_testnet_0)
    expect(privateKey1).toEqual(private_key_testnet_1)
    expect(privateKeyMainnet0).toEqual(private_key_mainnet_0)
  })

  test('creates new mnemonics', () => {
    const kms0 = KeyManagementSystem.create()
    const kms1 = KeyManagementSystem.create()

    expect(kms0.mnemonic).not.toEqual(kms1.mnemonic)
  })
})
