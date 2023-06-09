import { ERC20__factory, getAllTokens, ERC20Token } from '@rsksmart/rif-wallet-token'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { formatBigNumber } from '../formatBigNumber'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber } from '@ethersproject/bignumber'

export const findToken = async (signer: Signer, tokenAddress: string | undefined) : Promise<ERC20Token> => {
  const tokens = await getAllTokens(signer)
  // TODO: mixed up logic, needs refactor
  const tokenFounded = tokens.find(
    x => x.address.toLowerCase() === tokenAddress?.toLowerCase()
  ) as ERC20Token

  return tokenFounded
}

export class ERC20EnhanceStrategy implements EnhanceStrategy {
  public async parse (
    signer: Signer,
    transactionRequest: TransactionRequest
  ): Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const tokenFounded = await findToken(signer, transactionRequest.to)
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
    } catch (error) {
      return null
    }

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
