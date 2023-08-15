import {
  EstimateFeeType,
  IPayment,
  ISendTransactionJsonReturnData,
  OnSendTransactionFunction,
  PaymentType,
  Psbt
} from '../types'

export class BIPPaymentFacade {
  payment: IPayment
  onSendTransaction: OnSendTransactionFunction
  constructor (
    payment: IPayment,
    onSendTransaction: OnSendTransactionFunction
  ) {
    this.payment = payment
    this.onSendTransaction = onSendTransaction
  }

  async generatePayment ({
    amountToPay,
    addressToPay,
    unspentTransactions,
    miningFee,
    addressToReturnRemainingAmount,
  }: PaymentType) {
    return this.payment.generatePayment(
      amountToPay,
      addressToPay,
      unspentTransactions,
      miningFee,
      addressToReturnRemainingAmount
    )
  }

  signPayment (payment: Psbt) {
    return this.payment.signPayment(payment)
  }

  getPaymentHex (payment: Psbt) {
    return this.payment.convertPaymentToHexString(payment)
  }

  async sendTransaction (hexData: string) {
    return this.onSendTransaction(hexData)
  }

  async signAndSend (payment: Psbt): Promise<ISendTransactionJsonReturnData> {
    const transaction = this.signPayment(payment)
    const hexData = this.getPaymentHex(transaction)
    return this.sendTransaction(hexData)
  }

  async estimateMiningFee ({
    amountToPay,
    addressToPay,
    unspentTransactions,
    addressToReturnRemainingAmount,
  }: EstimateFeeType) {
    const payment: Psbt = await this.generatePayment({
      amountToPay,
      addressToPay,
      unspentTransactions,
      miningFee: 0,
      addressToReturnRemainingAmount,
    })
    const signedPayment: Psbt = this.signPayment(payment)
    return signedPayment.extractTransaction().virtualSize()
  }
}
