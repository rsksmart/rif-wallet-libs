import { RIFWallet } from '../../../core/src/RIFWallet'
import { IResolver } from '../RPCAdapter'

export class AccountsResolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_accounts'

  constructor (signer: RIFWallet) {
    this.signer = signer
  }

  async resolve () {
    return [this.signer.smartWalletAddress]
  }
}
