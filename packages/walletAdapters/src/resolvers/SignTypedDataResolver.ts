import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { IResolver } from '../RPCAdapter'

export class SignTypedDataResolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_signTypedData'
  public validate: (domain: any, message: any, types: any) => void

  constructor(signer: RIFWallet) {
    this.signer = signer
    this.validate = () => {}
  }

  async resolve(params: any[]) {
    // TODO: what is the type here?
    const { domain, message, types } = JSON.parse(params[1])

    // delete domain type
    if (types.EIP712Domain) {
      delete types.EIP712Domain
    }
    this.validate(domain, message, types)
    return this.signer._signTypedData(domain, types, message)
  }
}
