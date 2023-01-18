import BitcoinNetwork from '../src/core/BitcoinNetwork'
import * as constants from '../src/constants'
import BIP39 from '../src/core/BIP39'

describe('BitcoinNetwork tests', function () {
  describe('Mnemonic rely truly issue ghost elder intact kiss provide project hobby thumb thing blur slender true', () => {
    const mnemonic = 'rely truly issue ghost elder intact kiss provide project hobby thumb thing blur slender true'
    const bip39Instance = new BIP39(mnemonic)

    describe('Create Testnet BitcoinNetwork with BIP84', () => {
      const bitcoinInstance = new BitcoinNetwork(
        constants.NETWORK_ID.BITCOIN_TESTNET,
        [constants.BIP_ID.BIP84],
        bip39Instance
      )

      it('Should be the networkId BITCOIN_TESTNET', () => {
        expect(bitcoinInstance.networkId).toBe('BITCOIN_TESTNET')
      })

      it('Should update the balance and the balance should be 0', async () => {
        await bitcoinInstance.updateBalance()
        expect(bitcoinInstance.balance).toBe(0)
      })

      it('Should contain the BIP84 in the array of BIPS', () => {
        expect(bitcoinInstance.bips.find(bip => bip.bipNumber === 84)).not.toBe(undefined)
      })

      it('Should NOT contain the BIP44 in the array of BIPS', () => {
        expect(bitcoinInstance.bips.find(bip => bip.bipNumber === 44)).toBe(undefined)
      })
    })
  })
})
