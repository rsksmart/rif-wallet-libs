import { Signer } from '@ethersproject/abstract-signer'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { PersonalSignResolver, SendTransactionResolver, SignTypedDataResolver } from './resolvers'
import { IResolver, RPCAdapter } from './RPCAdapter'

export class WalletConnectAdapter extends RPCAdapter {
  constructor(signer: Signer, resolvers: IResolver[] = []) {
    let resolversToUse = resolvers
    if (resolvers.length === 0) {
      resolversToUse = [
        new SendTransactionResolver(signer),
        new PersonalSignResolver(signer),
        new SignTypedDataResolver(signer as RIFWallet),
      ]
    }
    super(resolversToUse)
  }
}
