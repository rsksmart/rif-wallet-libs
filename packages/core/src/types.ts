import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { RelayPayment } from '@rsksmart/rif-relay-light-sdk'
import { BigNumberish, BytesLike } from 'ethers'

export type IRequest<Type, Payload, ReturnType, ConfirmArgs> = {
  type: Type,
  payload: Payload
  returnType: ReturnType
  confirm: (args?: ConfirmArgs) => Promise<void>
  reject: (reason?: any) => void
}

export type OverriddableTransactionOptions = {
  gasLimit: BigNumberish,
  gasPrice: BigNumberish,
  tokenPayment?: RelayPayment
}

export type SendTransactionRequest = IRequest<
  'sendTransaction',
  [transactionRequest: TransactionRequest],
  TransactionResponse,
  Partial<OverriddableTransactionOptions>
>

export type SignMessageRequest = IRequest<
  'signMessage',
  [message: BytesLike],
  string,
  void
>

export type SignTypedDataArgs = Parameters<TypedDataSigner['_signTypedData']>

export type SignTypedDataRequest = IRequest<
  'signTypedData',
  SignTypedDataArgs,
  string,
  void
>

export type Request = SendTransactionRequest | SignMessageRequest | SignTypedDataRequest
export type OnRequest = (request: Request) => void
