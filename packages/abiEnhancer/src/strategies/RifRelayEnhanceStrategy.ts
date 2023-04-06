import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { formatBigNumber } from '../formatBigNumber'
import { ERC20__factory, ERC20Token, getAllTokens } from '@rsksmart/rif-wallet-token'

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

    const { request: { tokenContract, tokenAmount, data }, relayData: { callForwarder } } = tx.relayRequest as ForwardRequest
    const tokens = await getAllTokens(signer)
    const tokenFounded = tokens.find(
      x => x.address.toLowerCase() === tokenContract.toLowerCase()
    ) as ERC20Token
    if (!tokenFounded) {
      return null
    }
    const tokenDecimals = await tokenFounded.decimals()
    const currentBalance = await tokenFounded.balance()
    const abiErc20Interface = ERC20__factory.createInterface()
    const [decodedTo, decodedValue] = abiErc20Interface.decodeFunctionData(
      'transfer',
      data
    )

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
