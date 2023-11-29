import { BitcoinNetwork } from '../src'
import { mnemonic, mnemonicAddresses } from './testSharedConfig'
import * as constants from '../src/constants'

describe('BIP Class tests', () => {
  const bitcoinNetworkInstance = new BitcoinNetwork(
    constants.NETWORK_ID.BITCOIN_TESTNET,
    [constants.BIP_ID.BIP84, constants.BIP_ID.BIP44],
    mnemonic
  )

  describe(`BIP84 tests with mnemonic ${mnemonic}`, () => {
    const bip84 = bitcoinNetworkInstance.bipNames.BIP84

    mnemonicAddresses.forEach(mnemonicAddress => {
      it(`Should generate the address ${mnemonicAddress.bip84_address} of path ${mnemonicAddress.path} correctly`, () => {
        const address = bip84.getAddress(mnemonicAddress.index, mnemonicAddress.change)
        expect(address).toBe(mnemonicAddress.bip84_address)
      })
    })

    it('Should try to get the xpub balance and set it to 0 (fetcher is mocked)', async () => {
      const balance = await bip84.fetchBalance()
      expect(balance).toBe(0)
    })
  })

  describe(`BIP44 tests with mnemonic ${mnemonic}`, () => {
    const bip44 = bitcoinNetworkInstance.bipNames.BIP44

    mnemonicAddresses.forEach(mnemonicAddress => {
      it(`Should generate the address ${mnemonicAddress.bip44_address} of path ${mnemonicAddress.path} correctly`, () => {
        const address = bip44.getAddress(mnemonicAddress.index, mnemonicAddress.change)
        expect(address).toBe(mnemonicAddress.bip44_address)
      })
    })

    it('Should try to get the xpub balance and set it to 0 (fetcher is mocked)', async () => {
      const balance = await bip44.fetchBalance()
      expect(balance).toBe(0)
    })
  })
})
