import BitcoinNetwork from '../src/core/BitcoinNetwork'
import { bip39Instance, mnemonic } from './testSharedConfig'
import * as constants from '../src/constants'

describe('BIP Class tests', () => {
  const bitcoinNetworkInstance = new BitcoinNetwork(
    constants.NETWORK_ID.BITCOIN_TESTNET,
    [constants.BIP_ID.BIP84, constants.BIP_ID.BIP44],
    bip39Instance
  )

  describe(`BIP84 tests with mnemonic ${mnemonic}`, () => {
    const bip84 = bitcoinNetworkInstance.bipNames.BIP84

    it('Should generate the address of index m/84\'/1\'/0\'/0/0 ', () => {
      const address = bip84.getAddress(0)
      expect(address).toBe('tb1qfymt85557xnjm04wtg839vrmq6jx8njh05vhmm')
    })

    it('Should try to get the xpub balance and set it to 0 (fetcher is mocked)', async () => {
      const balance = await bip84.fetchBalance()
      expect(balance).toBe(0)
    })
  })

  describe(`BIP44 tests with mnemonic ${mnemonic}`, () => {
    const bip44 = bitcoinNetworkInstance.bipNames.BIP44
    it('Should generate the address of index m/44\'/1\'/0\'/0/0 ', () => {
      const address = bip44.getAddress(0)
      expect(address).toBe('mzo88FnZi9F1bSHnKZuyosaVbpYJWoZHJX')
    })

    it('Should try to get the xpub balance and set it to 0 (fetcher is mocked)', async () => {
      const balance = await bip44.fetchBalance()
      expect(balance).toBe(0)
    })
  })
})
