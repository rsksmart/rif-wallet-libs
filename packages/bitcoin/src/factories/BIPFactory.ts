import BIP from '../core/BIP'
import { createBipFactoryType } from '../types'

export default function createBipFactory (...args: createBipFactoryType): BIP {
  return new BIP(...args)
}