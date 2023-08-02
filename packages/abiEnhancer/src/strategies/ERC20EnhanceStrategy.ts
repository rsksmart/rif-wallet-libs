import { ERC20__factory, ERC20 } from '@rsksmart/rif-wallet-token'
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatBigNumber } from '../formatBigNumber'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber } from '@ethersproject/bignumber'
import { getDefaultNodeUrl } from '../utils'

export const findToken = async (provider: Provider, tokenAddress: string | undefined) : Promise<ERC20> => {
  return tokenAddress ? ERC20__factory.connect(tokenAddress, provider) : null
}

export class ERC20EnhanceStrategy implements EnhanceStrategy {
  public async parse (
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ): Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }
    const url = nodeUrl || getDefaultNodeUrl(chainId)
    const provider = new JsonRpcProvider(url)
    const tokenFounded = await findToken(provider, transactionRequest.to)
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
      const tokenDecimals = await tokenFounded.decimals()
      const tokenSymbol = await tokenFounded.symbol()

      return {
        ...transactionRequest,
        to: resultTo,
        symbol: tokenSymbol,
        value: formatBigNumber(BigNumber.from(resultValue ?? 0), tokenDecimals)
      }
    } catch (error) {
      return null
    }
  }
}
