import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ERC20__factory } from '@rsksmart/rif-wallet-token'
import { RelayRequest, relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { formatBigNumber } from './formatBigNumber'
import { getDefaultNodeUrl, getNativeCryptoCurrencySymbol } from './utils'
import { ERC20EnhanceStrategy, OtherEnhanceStrategy, findToken } from './strategies'

const strategies = [new ERC20EnhanceStrategy(), new OtherEnhanceStrategy()]

const deserializeRequest = async (request: RelayRequest, chainId: number, nodeUrl?: string) => {
  const { request: { tokenContract, tokenAmount, data, to, value }, relayData: { callForwarder } } = request

  const url = nodeUrl || getDefaultNodeUrl(chainId)
  const provider = new JsonRpcProvider(url)
  const feeTokenFounded = await findToken(provider, tokenContract)
  const rbtcSymbol = getNativeCryptoCurrencySymbol(chainId)
  let tokenSymbol = rbtcSymbol
  let tokenDecimals = 18
  try {
    const tokenFounded = ERC20__factory.connect(to, provider)
    tokenSymbol = await tokenFounded.symbol()
    tokenDecimals = await tokenFounded.decimals()
  } catch (e) {

  }
  if (!feeTokenFounded) {
    return null
  }
  const feeTokenDecimals = await feeTokenFounded.decimals()
  const feeTokenSymbol = await feeTokenFounded.symbol()

  return { to, callForwarder, tokenSymbol, feeTokenSymbol, tokenDecimals, feeTokenDecimals, tokenAmount, value, data }
}

export const parseDeploy = async (chainId: number, transactionRequest: TransactionRequest, nodeUrl?: string) => {
  const decodedRequest = relayHubInterface.decodeFunctionData('deployCall', transactionRequest.data!)
  const tx = await deserializeRequest(decodedRequest.deployRequest, chainId, nodeUrl)
  if (!tx) return null
  const { to, callForwarder, tokenSymbol, feeTokenSymbol, tokenDecimals, feeTokenDecimals, tokenAmount, value } = tx
  return {
    to,
    from: callForwarder,
    symbol: tokenSymbol,
    value: formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals) || 0,
    feeSymbol: feeTokenSymbol,
    feeValue: formatBigNumber(BigNumber.from(tokenAmount), feeTokenDecimals)
  }
}

export const parseRelay = async (chainId: number, transactionRequest: TransactionRequest, nodeUrl?: string) => {
  const decodedRequest = relayHubInterface.decodeFunctionData('relayCall', transactionRequest.data!)
  const tx = await deserializeRequest(decodedRequest.relayRequest, chainId, nodeUrl)
  if (!tx) return null
  const { to, callForwarder, tokenSymbol, feeTokenSymbol, tokenDecimals, feeTokenDecimals, tokenAmount, value, data } = tx
  let result
  for (const strategy of strategies) {
    result = await strategy.parse(chainId, {
      from: transactionRequest.from,
      data,
      value: transactionRequest.value,
      to
    }, nodeUrl)
    if (result) {
      break
    }
  }
  return {
    to: result?.to || to,
    from: callForwarder,
    symbol: tokenSymbol,
    value: result?.value || formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals) || 0,
    feeSymbol: feeTokenSymbol,
    feeValue: formatBigNumber(BigNumber.from(tokenAmount), feeTokenDecimals)
  }
}
