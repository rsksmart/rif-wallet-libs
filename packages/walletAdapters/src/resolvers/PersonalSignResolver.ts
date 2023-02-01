import { Signer } from '@ethersproject/abstract-signer'
import { toUtf8String } from '@ethersproject/strings'
import { IResolver } from '../RPCAdapter'

export class PersonalSignResolver implements IResolver {
  private signer: Signer
  public methodName = 'personal_sign'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: string[]) {
    // TODO: is this correct?
    let message = params[0]

    try {
      message = toUtf8String(params[0])
    } catch {
      // use original message
    }

    return this.signer.signMessage(message)
  }
}
