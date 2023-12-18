import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { RelayPayment } from '@rsksmart/rif-relay-light-sdk'

export type IncomingRequest<Type, Payload, ReturnType, ConfirmArgs> = {
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
  pendingTxsCount?: number
}

export type SendTransactionRequest = IncomingRequest<
  'sendTransaction',
  [transactionRequest: TransactionRequest],
  TransactionResponse,
  Partial<OverriddableTransactionOptions>
>

export type SignMessageRequest = IncomingRequest<
  'signMessage',
  [message: BytesLike],
  string,
  void
>

export type SignTypedDataArgs = Parameters<TypedDataSigner['_signTypedData']>

export type SignTypedDataRequest = IncomingRequest<
  'signTypedData',
  SignTypedDataArgs,
  string,
  void
>

export type Request = SendTransactionRequest | SignMessageRequest | SignTypedDataRequest
export type OnRequest = (request: Request) => void
