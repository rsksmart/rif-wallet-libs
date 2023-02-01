import { Signer } from '@ethersproject/abstract-signer'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { PersonalSignResolver, SendTransactionResolver, SignTypedDataResolver } from './resolvers'
import { RPCAdapter } from './RPCAdapter'

export class WalletConnectAdapter extends RPCAdapter {
  constructor(signer: Signer) {
    super([
      new SendTransactionResolver(signer),
      new PersonalSignResolver(signer),
      new SignTypedDataResolver(signer as unknown as RIFWallet),
    ])
  }
}
