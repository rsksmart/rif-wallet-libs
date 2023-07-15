import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import axios from 'axios'
import { hexDataSlice, BytesLike } from '@ethersproject/bytes'
import { defaultAbiCoder } from '@ethersproject/abi/lib'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import FaucetAbi from './FaucetABI.json'
import { formatBigNumber } from '../formatBigNumber'
import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { findToken } from './ERC20EnhanceStrategy'
import { getDefaultNodeUrl, getRbtcSymbol } from '../utils'

const ethList4BytesServiceUrl =
  'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures'
const ethList4BytesWithNamesServiceUrl =
  'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/with_parameter_names'

const getFunctionSignatures = async (fnHexSig: string) => {
  const functionSignaturePromise = axios
    .get(`${ethList4BytesServiceUrl}/${fnHexSig}`)
    .then(x => x.data)
  const functionSignatureWithNamesPromise = axios
    .get(`${ethList4BytesWithNamesServiceUrl}/${fnHexSig}`)
    .then(x => x.data)

  return Promise.all([
    functionSignaturePromise,
    functionSignatureWithNamesPromise
  ])
}

const getHexSig = (data: BytesLike) => {
  const firstFourBytes = hexDataSlice(data, 0, 4)
  const functionHexWithout0x = firstFourBytes.substring(2)

  return functionHexWithout0x
}

const parseSignature = (signatures: string) => {
  const INSIDE_PARENTHESIS = 1

  const firstSignature = signatures.split(';')[0]
  const regexParameters = /\((.*)\)/
  const regexNameExpression = /(.*)\(/
  const parametersExpression = new RegExp(regexParameters).exec(firstSignature)
  const nameExpression = new RegExp(regexNameExpression).exec(firstSignature)

  const parameters: string[] = parametersExpression
    ? parametersExpression[INSIDE_PARENTHESIS].split(',')
    : []

  const name = nameExpression ? nameExpression[INSIDE_PARENTHESIS] : ''

  return [name, parameters] as const
}

const parseSignatureWithParametersNames = (
  signaturesWithNames: string,
  parametersTypes: string[]
) => {
  const INSIDE_PARENTHESIS = 1

  const firstSignature = signaturesWithNames.split(';')[0]
  const regexParameters = /\((.*)\)/
  const parametersExpression = new RegExp(regexParameters).exec(firstSignature)

  const parametersNames: string[] = parametersExpression
    ? parametersExpression[INSIDE_PARENTHESIS].split(',')
    : []

  for (let index = 0; index < parametersNames.length; index++) {
    parametersNames[index] = parametersNames[index]
      .replace(`${parametersTypes[index]} `, '')
      .replace(/[_\-\s]/g, '')
  }

  return parametersNames
}

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
    const feeSymbol = getRbtcSymbol(chainId)
    return {
      ...transactionRequest,
      from: transactionRequest.to,
      to,
      value: formatBigNumber(BigNumber.from(value ?? 0), tokenDecimals),
      symbol: token.symbol,
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

    let signaturesFounded: string[] | null = []
    try {
      signaturesFounded = await getFunctionSignatures(hexSig)
    } catch {
      signaturesFounded = null
    }

    if (!signaturesFounded) {
      return null
    }

    const [signatures, signaturesWithParametersNames] = signaturesFounded

    const [functionName, parametersTypes] = parseSignature(signatures)

    let parametersNames: string[] = []
    let parametersValues: ReadonlyArray<string> = []

    if (parametersTypes.length > 0) {
      parametersNames = parseSignatureWithParametersNames(
        signaturesWithParametersNames,
        parametersTypes
      )

      parametersValues = defaultAbiCoder.decode(
        parametersTypes,
        hexDataSlice(transactionRequest.data, 4)
      )
    }

    const result: EnhancedResult = {
      ...transactionRequest,
      functionName,
      functionParameters: [],
      from: transactionRequest.from,
      to: transactionRequest.to
    }
    for (let index = 0; index < parametersNames.length; index++) {
      const name = parametersNames[index]
      const value = parametersValues[index]
      result.functionParameters?.push({ name, value })
    }

    return result
  }
}
