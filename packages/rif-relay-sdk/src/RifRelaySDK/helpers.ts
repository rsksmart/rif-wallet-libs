import {
  DeployRequestType,
  DomainSeparatorType,
  RelayDataType,
  RelayRequestType
} from './types'
import { TransactionRequest } from '@ethersproject/abstract-provider'

export interface EIP712Domain {
  name?: string | undefined
  version?: string | undefined
  chainId?: string | number | undefined
  verifyingContract?: string | undefined
  salt?: string | undefined
}

export const dataTypeFields = (isDeployRequest: boolean) => ({
  RelayRequest: isDeployRequest ? DeployRequestType : RelayRequestType,
  RelayData: RelayDataType
})

export function getDomainSeparator (
  verifyingContract: string,
  chainId: number
): EIP712Domain {
  return {
    name: DomainSeparatorType.name,
    version: DomainSeparatorType.version,
    chainId: chainId,
    verifyingContract: verifyingContract
  }
}

export const filterTxOptions = (transactionRequest: TransactionRequest) =>
  Object.keys(transactionRequest)
    .filter(key => !['from', 'to', 'data'].includes(key))
    .reduce((obj: any, key: any) => {
      obj[key] = (transactionRequest as any)[key]
      return obj
    }, {})

export const validUntilTime = () => Math.floor(Date.now() / 1000) + TWO_DAYS

export const MAX_RELAY_NONCE_GAP = 3
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const TWO_DAYS = 172800
