import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ContractTransaction } from '@ethersproject/contracts'

export type TokenType = 'erc20' | 'rbtc'

export class BaseToken {
  public signer: Signer
  public symbol: string
  public logo: string | undefined

  constructor(signer: Signer, symbol: string, logo?: string) {
    this.signer = signer
    this.symbol = symbol
    this.logo = logo
  }

  protected async getAccountAddress() {
    return await this.signer.getAddress()
  }
}

export interface ITransferOptions {
  gasPrice: BigNumberish
  gasLimit: BigNumberish
  nonce: BigNumberish
}

export interface IToken {
  getType: () => TokenType
  decimals: () => Promise<number>
  balance: () => Promise<BigNumber>
  transfer: (
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ) => Promise<ContractTransaction>
  logo: string | undefined
  symbol: string
  address: string
}

export const ten = BigNumber.from(10)
export const tenPow = (exp: BigNumberish) => ten.pow(exp)
