import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { formatBigNumber } from '../formatBigNumber'
import { ERC20Token, getAllTokens } from '@rsksmart/rif-wallet-token'
import { Interface } from '@ethersproject/abi'

interface ForwardRequestStruct {
  relayHub: string
  from: string
  to: string
  tokenContract: string
  value: BigNumberish
  gas: BigNumberish
  nonce: BigNumberish
  tokenAmount: BigNumberish
  tokenGas: BigNumberish
  validUntilTime: BigNumberish
  data: BytesLike
};
interface ForwardRequest {
  request: ForwardRequestStruct,
  relayData: {
    callForwarder: string
  }
}

export class RifRelayEnhanceStrategy implements EnhanceStrategy {
  public async parse(signer: Signer, transactionRequest: TransactionRequest) : Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }
    let tx
    try {
      tx = relayHubInterface.decodeFunctionData('relayCall', transactionRequest.data)
    } catch (e) {
      return null
    }

    const { request: { tokenContract, tokenAmount, data, to }, relayData: { callForwarder } } = tx.relayRequest as ForwardRequest
    const tokens = await getAllTokens(signer)
    const tokenFounded = tokens.find(
      x => x.address.toLowerCase() === tokenContract.toLowerCase()
    ) as ERC20Token
    if (!tokenFounded) {
      return null
    }
    const tokenDecimals = await tokenFounded.decimals()
    const currentBalance = await tokenFounded.balance()
    const commonMethods = [
      'function transfer(address recipient, uint256 amount) external returns (bool)',
      'function commit(bytes32 commitment) external',
      'function transferAndCall(address receiver, uint amount, bytes data)'
    ]
    const commonInterface = new Interface(commonMethods)
    let decodedTo, decodedValue
    if (data.toString().startsWith(commonInterface.getSighash('transfer'))) {
      const [recipient, amount] = commonInterface.decodeFunctionData('transfer', data)
      decodedTo = recipient
      decodedValue = amount
    } else if (data.toString().startsWith(commonInterface.getSighash('commit'))) {
      commonInterface.decodeFunctionData('commit', data)
      decodedTo = to
    } else if (data.toString().startsWith(commonInterface.getSighash('transferAndCall'))) {
      const [recipient, amount] = commonInterface.decodeFunctionData('transferAndCall', data)
      decodedTo = recipient
      decodedValue = amount
    } else {
      return null
    }

    return {
      from: callForwarder,
      to: decodedTo,
      symbol: tokenFounded.symbol,
      value: formatBigNumber(BigNumber.from(decodedValue ?? 0), tokenDecimals),
      balance: formatBigNumber(currentBalance, tokenDecimals),
      feeSymbol: tokenFounded.symbol,
      feeValue: formatBigNumber(BigNumber.from(tokenAmount), tokenDecimals)
    }
  }
}
