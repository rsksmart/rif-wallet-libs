import { BigNumber } from '@ethersproject/bignumber'

import { RBTCEnhanceStrategy } from '../src'
import { TESTNET_CHAIN_ID } from './utils'

describe('RBTC Enhance Strategy', () => {
  const transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    value: BigNumber.from(1000000000000000), // 0.001 in decimals
  }

  it('should return transaction info enhanced', async () => {
    const strategy = new RBTCEnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, transactionRequest)

    expect(result).not.toBeNull()
    expect(result?.from).toBe(transactionRequest.from)
    expect(result?.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
    expect(result?.value).toBe('0.001')
  })
})
