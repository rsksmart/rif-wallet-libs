import { ERC20__factory, getAllTokens, ERC20Token } from '@rsksmart/rif-wallet-token'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { formatBigNumber } from '../formatBigNumber'
import { IEnhancedResult, IEnhanceStrategy } from '@rsksmart/rif-wallet-types'
import { BigNumber } from '@ethersproject/bignumber'

export class ERC20EnhanceStrategy implements IEnhanceStrategy {
  public async parse (
    signer: Signer,
    transactionRequest: TransactionRequest
  ): Promise<IEnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const tokens = await getAllTokens(signer)
    // TODO: mixed up logic, needs refactor
    const tokenFounded = tokens.find(
      x => x.address.toLowerCase() === transactionRequest.to?.toLowerCase()
    ) as ERC20Token

    if (!tokenFounded) {
      return null
    }

    const abiErc20Interface = ERC20__factory.createInterface()

    let resultTo = transactionRequest.to
    let resultValue = transactionRequest.value

    try {
      const [decodedTo, decodedValue] = abiErc20Interface.decodeFunctionData(
        'transfer',
        transactionRequest.data
      )
      resultTo = decodedTo
      resultValue = decodedValue
    } catch (error) {}

    const currentBalance = await tokenFounded.balance()
    const tokenDecimals = await tokenFounded.decimals()
    const tokenSymbol = tokenFounded.symbol

    return {
      ...transactionRequest,
      to: resultTo,
      symbol: tokenSymbol,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      value: formatBigNumber(BigNumber.from(resultValue ?? 0), tokenDecimals)
    }
  }
}