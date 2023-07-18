import { OtherEnhanceStrategy } from '../src'
import { TESTNET_CHAIN_ID } from './utils'

describe('Other Enhance Strategy', () => {
  const transactionRequest = {
    from: '0xC0c9280C10e4d968394371d5B60Ac5FcD1AE62E1',
    to: '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
    data: '0x5f746233000000000000000000000000582c42032d16b0fbc70ae9e3d95538974f061122',
  }

  it('should return transaction info enhanced', async () => {
    const strategy = new OtherEnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, transactionRequest)
    expect(result).not.toBeNull()
    expect(result?.from).toBe(transactionRequest.to)
    expect(result?.to).toBe('0x582c42032D16b0fBC70aE9e3d95538974f061122')
    expect(result?.value).toBe('100')
    expect(result?.symbol).toBe('tRIF')
    expect(result?.feeSymbol).toBe('TRBTC')
  }, 30000)

  it('should return null if data is empty', async () => {
    const strategy = new OtherEnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, {
      ...transactionRequest,
      data: undefined,
    })

    expect(result).toBeNull()
  })

  it('should return null if it could not find the method definition', async () => {
    const customFunctionData =
      '0xa9959cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000'

    const strategy = new OtherEnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, {
      ...transactionRequest,
      data: customFunctionData,
    })

    expect(result).toBeNull()
  })
})
