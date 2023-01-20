import { BIP } from '../core/BIP'
import { createBipFactoryType } from '../types'

export function createBipFactory (...args: createBipFactoryType): BIP {
  return new BIP(...args)
}
