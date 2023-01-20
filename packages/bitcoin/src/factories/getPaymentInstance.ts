import { BIP84Payment } from '../core/payments/BIP84Payment'
import { IPayment, NetworkInfoType, HDSigner } from '../types'

export function getPaymentInstance (
  paymentType = 'p2wpkh',
  bip32root: HDSigner,
  networkInfo: NetworkInfoType
): IPayment {
  switch (paymentType) {
    case 'p2wpkh':
    default:
      return new BIP84Payment(bip32root, networkInfo)
  }
}
