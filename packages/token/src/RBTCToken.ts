import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import constants from '@ethersproject/constants'
import { ContractTransaction } from '@ethersproject/contracts'
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken'

export class RBTCToken extends BaseToken implements IToken {
  public chainId: number
  public address: string

  constructor(signer: Signer, symbol: string, logo: string, chainId: number) {
    super(signer, symbol, logo)

    this.chainId = chainId
    this.address = constants.AddressZero
  }

  public getType(): TokenType {
    return 'rbtc'
  }

  public async decimals(): Promise<number> {
    return 18
  }

  public async balance(): Promise<BigNumber> {
    return this.signer.getBalance()
  }

  public async transfer(
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ): Promise<ContractTransaction> {
    const account = await this.getAccountAddress()

    return this.signer.sendTransaction({
      from: account,
      to: recipientAddress,
      value: amount,
      ...options,
    })
  }
}
