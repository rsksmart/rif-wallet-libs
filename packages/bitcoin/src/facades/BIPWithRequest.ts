import { BIP } from '../core/BIP'
import { BIPRequestPaymentFacade } from './BIPRequestPaymentFacade'
import { BitcoinRequestFunction, OnSendTransactionFunction } from '../types'
import { BIPPaymentFacade } from './BIPPaymentFacade'

export class BIPWithRequest extends BIP {
  request!: BitcoinRequestFunction
  paymentFacade!: BIPPaymentFacade
  requestPayment!: BIPRequestPaymentFacade
  onSendTransaction!: OnSendTransactionFunction
  setRequest (request: BitcoinRequestFunction) {
    this.request = request
  }

  setPaymentFacade () {
    this.paymentFacade = new BIPPaymentFacade(this.payment, this.onSendTransaction)
  }

  initialize (
    request: BitcoinRequestFunction,
    onSendTransaction: OnSendTransactionFunction = (hexdata: string) => new Promise((resolve) => resolve({ result: hexdata }))) {
    this.onSendTransaction = onSendTransaction
    this.setPaymentFacade()
    this.setRequest(request)
    this.requestPayment = new BIPRequestPaymentFacade(
      this.request,
      this.paymentFacade
    )
  }
}
