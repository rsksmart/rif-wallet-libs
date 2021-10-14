import { providers } from 'ethers'

const nodeUrl = 'http://localhost:8545'
export const jsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)