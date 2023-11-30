import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import FaucetAbi from './FaucetABI.json'
import { formatBigNumber } from '../formatBigNumber'
import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { findToken } from './ERC20EnhanceStrategy'
import { getDefaultNodeUrl, getHexSig, getNativeCryptoCurrencySymbol } from '../utils'

const handleFaucet = async (
  hexSig: string,
  transactionRequest: TransactionRequest,
  provider: Provider, chainId: number) => {
  const faucetMethod = ['function dispense(address to)']
  const faucetInterface = new Interface(faucetMethod)
  if (faucetInterface.getSighash('dispense') === `0x${hexSig}`) {
    const faucetContract = new Contract(transactionRequest.to!, FaucetAbi, provider)
    const [to] = faucetInterface.decodeFunctionData('dispense', transactionRequest.data!)
    const tokenContract = await faucetContract.tokenContract()
    const value = await faucetContract.dispenseValue()
    const token = await findToken(provider, tokenContract)
    const tokenDecimals = await token.decimals()
    const tokenSymbol = await token.symbol()
    const feeSymbol = getNativeCryptoCurrencySymbol(chainId)
    return {
      ...transactionRequest,
      from: transactionRequest.to,
      to,
      value: formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals),
      symbol: tokenSymbol,
      feeSymbol
    }
  }
  return null
}

export class OtherEnhanceStrategy implements EnhanceStrategy {
  public async parse (
    chainId: number,
    transactionRequest: TransactionRequest,
    nodeUrl?: string
  ): Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const hexSig = getHexSig(transactionRequest.data)
    const url = nodeUrl || getDefaultNodeUrl(chainId)
    const provider = new JsonRpcProvider(url)
    const faucet = await handleFaucet(hexSig, transactionRequest, provider, chainId)
    if (faucet) {
      return faucet
    }

    const commonMethods = [
      'function commit(bytes32 commitment) external',
      'function transferAndCall(address receiver, uint amount, bytes data)'
    ]
    const commonInterface = new Interface(commonMethods)
    let decodedTo, decodedValue
    const data = transactionRequest.data
    if (data.toString().startsWith(commonInterface.getSighash('commit'))) {
      const [params] = commonInterface.decodeFunctionData('commit', data)
      return {
        ...transactionRequest,
        functionParameters: params
      }
    } else if (data.toString().startsWith(commonInterface.getSighash('transferAndCall'))) {
      const [recipient, amount] = commonInterface.decodeFunctionData('transferAndCall', data)
      decodedTo = recipient
      decodedValue = amount
      return {
        ...transactionRequest,
        to: decodedTo,
        value: formatBigNumber(BigNumber.from(decodedValue ?? 0), 18)
      }
    }

    return null
  }
}
