import { BigNumber } from '@ethersproject/bignumber'
import { formatBigNumber } from '../src'

const decimals = 18

describe('formatBigNumber', () => {
  it('should format a BigNumber', () => {
    const amount = BigNumber.from('1000000000000000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('1')
  })
  it('should format a BigNumber with decimals', () => {
    const amount = BigNumber.from('0100000000000000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('0.1')
  })
  it('should format a BigNumber with decimals and precision', () => {
    const amount = BigNumber.from('1234000000000000000')
    const result = formatBigNumber(amount, decimals, 2)
    expect(result).toEqual('1.23')
  })
  it('should format 100', () => {
    const amount = BigNumber.from('100000000000000000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('100')
  })
  it('should format 100.222', () => {
    const amount = BigNumber.from('100222000000000000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('100.222')
  })
  it('should format 100.222 with precision 2', () => {
    const amount = BigNumber.from('100222000000000000000')
    const result = formatBigNumber(amount, decimals, 2)
    expect(result).toEqual('100.22')
  })
  it('should format 100.222 with precision 3', () => {
    const amount = BigNumber.from('100222000000000000000')
    const result = formatBigNumber(amount, decimals, 3)
    expect(result).toEqual('100.222')
  })
  it('should format 100.222 with precision 4', () => {
    const amount = BigNumber.from('100222000000000000000')
    const result = formatBigNumber(amount, decimals, 4)
    expect(result).toEqual('100.222')
  })
  it('should return 0 for too small amount', () => {
    const amount = BigNumber.from('1000000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('0')
  })
  it('should format small amount with a higher precision', () => {
    const amount = BigNumber.from('123456789012')
    const result = formatBigNumber(amount, decimals, 12)
    expect(result).toEqual('0.000000123456')
  })
  it('should format small amount with default precsion', () => {
    const amount = BigNumber.from('12345678900')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('0.00000001')
  })
  it('should format amounts with maximum precision', () => {
    const amounts = [
      [BigNumber.from('100000000000000000000'), '100'],
      [BigNumber.from('10000000000000000000'), '10'],
      [BigNumber.from('1000000000000000000'), '1'],
      [BigNumber.from('100000000000000000'), '0.1'],
      [BigNumber.from('10000000000000000'), '0.01'],
      [BigNumber.from('1000000000000000'), '0.001'],
      [BigNumber.from('100000000000000'), '0.0001'],
      [BigNumber.from('10000000000000'), '0.00001'],
      [BigNumber.from('1000000000000'), '0.000001'],
      [BigNumber.from('100000000000'), '0.0000001'],
      [BigNumber.from('10000000000'), '0.00000001'],
      [BigNumber.from('1000000000'), '0.000000001'],
      [BigNumber.from('100000000'), '0.0000000001'],
      [BigNumber.from('10000000'), '0.00000000001'],
      [BigNumber.from('1000000'), '0.000000000001'],
      [BigNumber.from('100000'), '0.0000000000001'],
      [BigNumber.from('10000'), '0.00000000000001'],
      [BigNumber.from('1000'), '0.000000000000001'],
      [BigNumber.from('100'), '0.0000000000000001'],
      [BigNumber.from('10'), '0.00000000000000001'],
      [BigNumber.from('1'), '0.000000000000000001'],
    ]
    amounts.forEach(([amount, expected]) => {
      const result = formatBigNumber(amount as BigNumber, decimals, decimals)
      expect(result).toEqual(expected)
    })
  })
  it('should format big amount with some decimals', () => {
    const amount = BigNumber.from('1000200002000020000000')
    const result = formatBigNumber(amount, decimals)
    expect(result).toEqual('1000.200002')
  })
  it('handles 0', ()=> {
    const amount = BigNumber.from('0')
    const result = formatBigNumber(amount, 8)
    expect(result).toEqual('0')
  })
})
