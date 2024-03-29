import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { IResolver } from '../RPCAdapter'

export class SignTypedDataV4Resolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_signTypedData_v4'

  constructor(signer: RIFWallet) {
    this.signer = signer
  }

  async resolve(params: string[]) {
    // TODO: what is the type here?
    const { domain, message, types } = JSON.parse(params[1])

    // delete domain type
    if (types.EIP712Domain) {
      delete types.EIP712Domain
    }

    return this.signer._signTypedData(domain, types, message)
  }
}
