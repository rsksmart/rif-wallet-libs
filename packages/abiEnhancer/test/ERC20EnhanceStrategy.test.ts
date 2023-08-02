import { ERC20EnhanceStrategy } from '../src'
import { TESTNET_CHAIN_ID } from './utils'

describe('ERC20 Enhance Strategy', () => {
  const transactionRequest = {
    from: '0xC0c9280C10e4d968394371d5B60Ac5FcD1AE62E1',
    to: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    data: '0xa9059cbb0000000000000000000000007148df28f79a3a17304bd68cf123aa1db0fcdfe70000000000000000000000000000000000000000000000001feb3dd067660000',
  }

  it('should return transaction info enhanced', async () => {
    const strategy = new ERC20EnhanceStrategy()
    const result = await strategy.parse(TESTNET_CHAIN_ID, transactionRequest)

    expect(result).not.toBeNull()
    expect(result?.from).toBe(transactionRequest.from)
    expect(result?.to).toBe('0x7148Df28F79A3a17304bd68cf123aa1db0fCdfe7')
    expect(result?.value).toBe('2.3')
    expect(result?.symbol).toBe('tRIF')
  })

  it('should return null if data is empty', async () => {
    const strategy = new ERC20EnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, {
      ...transactionRequest,
      data: undefined,
    })

    expect(result).toBeNull()
  })

  it('should return null if the token is not in the tokens metadata', async () => {
    const strategy = new ERC20EnhanceStrategy()

    const result = await strategy.parse(TESTNET_CHAIN_ID, {
      ...transactionRequest,
      to: '0xNotExist',
    })

    expect(result).toBeNull()
  })
})
