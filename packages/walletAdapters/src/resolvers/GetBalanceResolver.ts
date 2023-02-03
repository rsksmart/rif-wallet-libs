import { Signer } from '@ethersproject/abstract-signer'
import { IResolver } from '../RPCAdapter'

export class GetBalanceResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getBalance'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    return this.signer.getBalance().then(b => b.toString())
  }
}
