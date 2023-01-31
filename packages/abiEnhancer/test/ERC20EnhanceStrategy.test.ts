import { BigNumber } from '@ethersproject/bignumber'
import { Signer } from '@ethersproject/abstract-signer'
import { ERC20EnhanceStrategy } from '../src'
import { deployTestTokens, getSigner } from './utils'
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

describe('ERC20 Enhance Strategy', () => {
  let transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000',
  }
  let accountSigner: Signer | null = null

  beforeEach(async () => {
    accountSigner = getSigner()

    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)

    // @ts-ignore
    getAllTokens.mockImplementation(async () => Promise.resolve([firstErc20Token, secondErc20Token]))
    // @ts-ignore
    makeRBTCToken.mockImplementation(() => rbtcToken)

    transactionRequest = { ...transactionRequest, to: firstErc20Token.address }
  })

  it('should return transaction info enhanced', async () => {
    const strategy = new ERC20EnhanceStrategy()
    if (accountSigner) {
      const result = await strategy.parse(accountSigner, transactionRequest)

      expect(result).not.toBeNull()
      expect(result?.from).toBe(transactionRequest.from)
      expect(result?.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
      expect(result?.balance).toBe(BigNumber.from(200).toString())
      expect(result?.value).toBe('0.001')
    }
  })

  it('should return null if data is empty', async () => {
    const strategy = new ERC20EnhanceStrategy()

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        data: undefined,
      })

      expect(result).toBeNull()
    }
  })

  it('should return null if the token is not in the tokens metadata', async () => {
    const strategy = new ERC20EnhanceStrategy()

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        to: '0xNotExist',
      })

      expect(result).toBeNull()
    }
  })
})
