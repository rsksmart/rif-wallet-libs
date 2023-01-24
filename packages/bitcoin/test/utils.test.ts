import { convertBtcToSatoshi, convertSatoshiToBtcHuman, isBitcoinAddressValid, validateAmount } from '../src'
import { addressesOrganized } from './bitcoinMock'
import { BigNumber } from '@ethersproject/bignumber'

function testAddresses (
  addresses: string[],
  shouldBeValid: boolean,
  expect: jest.Expect
) {
  for (const address of addresses) {
    expect(isBitcoinAddressValid(address)).toEqual(shouldBeValid)
  }
}
describe('Utils', () => {
  describe('isBitcoinAddressValid', () => {
    const { BIP84, BIP44 } = addressesOrganized
    it('Should return true (VALID) for the bitcoin mainnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.mainnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin mainnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.mainnet.invalid, false, expect)
    })

    it('Should return true (VALID) for the bitcoin testnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.testnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin testnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.testnet.invalid, false, expect)
    })

    /**
     * BIP 44 Tests
     */

    it('Should return true (VALID) for the bitcoin mainnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.mainnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin mainnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.mainnet.invalid, false, expect)
    })

    it('Should return true (VALID) for the bitcoin testnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.testnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin testnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.testnet.invalid, false, expect)
    })
  })

  describe('convertBtcToSatoshi', () => {
    it('should convert 1 btc to 100000000 satoshi', () => {
      const result = convertBtcToSatoshi('1')
      expect(result.toString()).toBe('100000000')
    })

    it('should convert 10 btc to 1000000000 satoshi', () => {
      const result = convertBtcToSatoshi('10')
      expect(result.toString()).toBe('1000000000')
    })

    it('should convert 100 btc to 10000000000 satoshi', () => {
      const result = convertBtcToSatoshi('100')
      expect(result.toString()).toBe('10000000000')
    })

    it('should return 0 if empty string was set in the input', () => {
      const result = convertBtcToSatoshi('')
      expect(result.toString()).toBe('0')
    })
  })

  describe('convertSatoshiToBtcHuman', () => {
    it('should convert 100000000 satoshi to 1 btc', () => {
      const result = convertSatoshiToBtcHuman('100000000')
      expect(result).toBe('1.0')
    })

    it('should convert 1000 satoshi to 0.00001 btc', () => {
      const result = convertSatoshiToBtcHuman('1000')
      expect(result).toBe('0.00001')
    })

    it('should convert 10000 satoshi to 0.00001 btc', () => {
      const result = convertSatoshiToBtcHuman('10000')
      expect(result).toBe('0.0001')
    })
  })

  describe('validateAmount', () => {
    it('Should return isValid true when you have 10000 satoshi of balance and want to spend 1000', () => {
      const result = validateAmount(BigNumber.from('1000'), BigNumber.from('10000'))
      expect(result).toMatchObject({ isValid: true, message: '' })
    })

    it('Should return isValid false when you have 1000 satoshi of balance and want to spend 10000', () => {
      const result = validateAmount(BigNumber.from('10000'), BigNumber.from('1000'))
      expect(result.isValid).toBe(false)
    })
  })
})
