import { Signer } from '@ethersproject/abstract-signer'
import { hexlify } from '@ethersproject/bytes'
import { IResolver } from '../RPCAdapter'

export class ChainIdResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_chainId'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    const chainId = await this.signer.getChainId()

    return hexlify(chainId)
  }
}
