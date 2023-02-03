import { BlockTag } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { IResolver } from '../RPCAdapter'

export class GetBlockByNumberResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getBlockByNumber'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(blockOrTag: BlockTag) {
    return this.signer.provider?.getBlock(blockOrTag)
  }
}
