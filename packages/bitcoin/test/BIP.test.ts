import { BitcoinNetwork } from '../src'
import { mnemonic, mnemonicAddressesMainnet, mnemonicAddressesTestnet } from './testSharedConfig'
import * as constants from '../src/constants'

/**
 * Helper function to run many bip tests easily
 * @param bipType
 * @param bipField
 * @param pathField
 * @param networkInstance
 * @param mnemonicAddresses
 * @param NETWORK
 */
function runBipTests(bipType: 'BIP84' | 'BIP44', bipField: 'bip84_address' | 'bip44_address', pathField: 'path_84' | 'path_44', networkInstance: BitcoinNetwork, mnemonicAddresses: typeof mnemonicAddressesTestnet, NETWORK: string) {
  describe(`NETWORK ${NETWORK} ${bipType} tests with mnemonic ${mnemonic}`, () => {
    const bip = networkInstance.bipNames[bipType]

    mnemonicAddresses.forEach(mnemonicAddress => {
      it(`Should generate the address ${mnemonicAddress[bipField]} of path ${mnemonicAddress[pathField]} correctly`, () => {
        const address = bip.getAddress(mnemonicAddress.index, mnemonicAddress.change)
        expect(address).toBe(mnemonicAddress[bipField])
      })
    })

    it('Should try to get the xpub balance and set it to 0 (fetcher is mocked)', async () => {
      const balance = await bip.fetchBalance()
      expect(balance).toBe(0)
    })
  })
}

describe('BIP Class tests', () => {
  const bitcoinNetworkInstanceTestnet = new BitcoinNetwork(
    constants.NETWORK_ID.BITCOIN_TESTNET,
    [constants.BIP_ID.BIP84, constants.BIP_ID.BIP44],
    mnemonic
  )
  const bitcoinNetworkInstanceMainnet = new BitcoinNetwork(
    constants.NETWORK_ID.BITCOIN,
    [constants.BIP_ID.BIP84, constants.BIP_ID.BIP44],
    mnemonic
  )

  runBipTests('BIP84', 'bip84_address', 'path_84', bitcoinNetworkInstanceMainnet, mnemonicAddressesMainnet, constants.NETWORK_ID.BITCOIN)
  runBipTests('BIP44', 'bip44_address', 'path_44', bitcoinNetworkInstanceMainnet, mnemonicAddressesMainnet, constants.NETWORK_ID.BITCOIN)
  runBipTests('BIP84', 'bip84_address', 'path_84', bitcoinNetworkInstanceTestnet, mnemonicAddressesTestnet, constants.NETWORK_ID.BITCOIN_TESTNET)
  runBipTests('BIP44', 'bip44_address', 'path_44', bitcoinNetworkInstanceTestnet, mnemonicAddressesTestnet, constants.NETWORK_ID.BITCOIN_TESTNET)
})
