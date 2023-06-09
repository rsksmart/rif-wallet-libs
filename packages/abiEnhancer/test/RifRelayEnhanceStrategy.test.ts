import { Signer } from '@ethersproject/abstract-signer'
import { deployTestTokens, getSigner } from './utils'
import { ERC20EnhanceStrategy, OtherEnhanceStrategy, RifRelayEnhanceStrategy } from '../src'
import { BigNumber } from '@ethersproject/bignumber'
import { getAllTokens, makeRBTCToken } from '@rsksmart/rif-wallet-token'

// Mock entire module
jest.mock('@rsksmart/rif-wallet-token', () => {
  // @ts-ignore
  const original = jest.requireActual('@rsksmart/rif-wallet-token')
  return {
    ...original,
    getAllTokens: jest.fn(),
    makeRBTCToken: jest.fn()
  }
})

describe('Rif Relay Enhance Strategy', () => {
  const transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    data: '0x528ab2ad00000000000000000000000000000000000000000000000000000000000000' +
    '4000000000000000000000000000000000000000000000000000000000000002c0000000000000' +
    '00000000000000000000000000000000000000000000000000a000000000000000000000000000' +
    '00000000000000000000000000000003ec44580000000000000000000000000967fe4fad8c9cdf' +
    '61c89f31c1d1f44770854ede0000000000000000000000007148df28f79a3a17304bd68cf123aa' +
    '1db0fcdfe7000000000000000000000000b86c972ff212838c4c396199b27a0dbe45560df80000' +
    '00000000000000000000ad525463961399793f8716b0d85133ff7503a7c2000000000000000000' +
    '00000043c65cd37c11cf4b96f6c37155300d435ee42b930000000000000000000000001cFCDaa1' +
    'B093d2c77A7D06A95B3A1Be2b87330750000000000000000000000001cFCDaa1B093d2c77A7D06' +
    'A95B3A1Be2b8733075000000000000000000000000000000000000000000000000000000000000' +
    '000000000000000000000000000000000000000000000000000000000000000042a20000000000' +
    '000000000000000000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000' +
    '00000000000000000000005d7c0000000000000000000000000000000000000000000000000000' +
    '0000642725b8000000000000000000000000000000000000000000000000000000000000016000' +
    '00000000000000000000000000000000000000000000000000000000000044a9059cbb00000000' +
    '0000000000000000c0c9280c10e4d968394371d5b60ac5fcd1ae62e10000000000000000000000' +
    '0000000000000000000000000029a2241af62c0000000000000000000000000000000000000000' +
    '000000000000000000000000000000000000000000000000000000000000000000000000000000' +
    '000041b341ce1df1a01a3950327438f367800a3135e77d9bb63fec7b1155e89f78b063438a598e' +
    '271757cfa73e20f9f788eff8c0af25863082ea4716715a20fd61d5891c00000000000000000000' +
    '000000000000000000000000000000000000000000',
  }
  let accountSigner: Signer | null = null

  beforeEach(async () => {
    accountSigner = getSigner()

    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)
    const decimals:() => Promise<number> = () => Promise.resolve(18)
    const balance:() => Promise<BigNumber> = () => Promise.resolve(BigNumber.from(0))
    // @ts-ignore
    getAllTokens.mockImplementation(async () => Promise.resolve([firstErc20Token, secondErc20Token, {
      decimals,
      balance,
      address: '0x1cFCDaa1B093d2c77A7D06A95B3A1Be2b8733075',
      symbol: 'RIF'
    }]))
    // @ts-ignore
    makeRBTCToken.mockImplementation(() => rbtcToken)
  })
  it('should return transaction info enhanced', async () => {
    const strategy = new RifRelayEnhanceStrategy([new ERC20EnhanceStrategy(), new OtherEnhanceStrategy()])
    if (accountSigner) {
      const result = await strategy.parse(accountSigner, transactionRequest)

      expect(result).not.toBeNull()
      expect(result?.from).toBe('0x7148Df28F79A3a17304bd68cf123aa1db0fCdfe7')
      expect(result?.to).toBe('0xC0C9280C10E4D968394371d5b60aC5fCD1ae62e1')
      expect(result?.balance).toBe(BigNumber.from(0).toString())
      expect(result?.value).toBe('3')
      expect(result?.feeSymbol).toBe('RIF')
      expect(result?.feeValue).toBe('2')
    }
  })

  it('should return null if data is empty', async () => {
    const strategy = new RifRelayEnhanceStrategy([new ERC20EnhanceStrategy(), new OtherEnhanceStrategy()])
    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        data: undefined,
      })

      expect(result).toBeNull()
    }
  })

  it('should return null if can not decode data', async () => {
    const strategy = new RifRelayEnhanceStrategy([new ERC20EnhanceStrategy(), new OtherEnhanceStrategy()])

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        data: '0xNotExist',
      })

      expect(result).toBeNull()
    }
  })
})
