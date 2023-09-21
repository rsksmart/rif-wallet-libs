import { relayHubInterface } from '@rsksmart/rif-relay-light-sdk'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { getHexSig } from '../utils'
import { parseDeploy, parseRelay } from '../RifRelayParser'

export class RifRelayEnhanceStrategy implements EnhanceStrategy {
  public async parse(chainId: number, transactionRequest: TransactionRequest, nodeUrl?: string) : Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }
    const map = new Map([
      [relayHubInterface.getSighash('deployCall'), parseDeploy],
      [relayHubInterface.getSighash('relayCall'), parseRelay]
    ])
    let parser
    try {
      parser = map.get(`0x${getHexSig(transactionRequest.data)}`)
    } catch (e) {
      return null
    }

    if (!parser) {
      return null
    }
    const result = await parser(chainId, transactionRequest, nodeUrl)
    if (!result) {
      return null
    }

    return result
  }
}
