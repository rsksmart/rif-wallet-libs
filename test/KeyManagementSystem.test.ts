import { providers, Wallet } from 'ethers'
import { KeyManagementSystem } from '../src/v2/KeyManagementSystem'
import { jsonRpcProvider } from './testRpcProvider'
import * as testCase from './test-case'

describe('KeyManagementSystem', () => {
  test('derives private keys given a mneomnic', () => {
    const kms = new KeyManagementSystem({ mnemonic: testCase.mnemonic })

    const wallet0 = kms.deriveWallet(31, 0)
    const wallet1 = kms.deriveWallet(31, 1)
    const walletMainnet0 = kms.deriveWallet(30, 0)

    expect(wallet0.privateKey).toEqual(testCase.private_key_testnet_0)
    expect(wallet1.privateKey).toEqual(testCase.private_key_testnet_1)
    expect(walletMainnet0.privateKey).toEqual(testCase.private_key_mainnet_0)

    expect(wallet0.address.toLowerCase()).toEqual(testCase.address_testnet_0)
    expect(wallet1.address.toLowerCase()).toEqual(testCase.address_testnet_1)
    expect(walletMainnet0.address.toLowerCase()).toEqual(testCase.address_mainnet_0)
  })

  test('creates new mnemonics', () => {
    const kms0 = KeyManagementSystem.create()
    const kms1 = KeyManagementSystem.create()

    expect(kms0.mnemonic).not.toEqual(kms1.mnemonic)
  })

  describe('e2e', function (this: {
    wallet: Wallet
  }) {
    beforeEach(() => {
      const kms = new KeyManagementSystem({ mnemonic: testCase.mnemonic })
      this.wallet = kms.deriveWallet(31, 0).connect(jsonRpcProvider)
    })

    test('signs messages', async () => {
      const sig = await this.wallet.signMessage(testCase.message)

      expect(sig).toEqual(testCase.sig_testnet_0)
    })

    test('can send transactions', async () => {
      const value = '0x0100'
      // send balance to the wallet to be tested
      const nodeWallet = jsonRpcProvider.getSigner()
      await (await nodeWallet.sendTransaction({ to: this.wallet.address, value: '0x10000000000000' })).wait()

      const to = KeyManagementSystem.create().deriveWallet(31, 0).address
      await (await this.wallet.sendTransaction({
        to,
        value
      })).wait()

      const actualBalance = (await jsonRpcProvider.getBalance(to)).toHexString()

      expect(actualBalance).toEqual(value)
    })
  })

  test('serialize', () => {
    const kms = new KeyManagementSystem({ mnemonic: testCase.mnemonic })
    const serialized = kms.serialize()
    const kmsFromSerialized = KeyManagementSystem.fromSerialize(serialized)
    expect(kmsFromSerialized.mnemonic).toEqual(testCase.mnemonic)
  })
})
