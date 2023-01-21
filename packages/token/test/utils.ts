import { providers } from 'ethers'

const nodeUrl = 'http://localhost:8545'
const provider = new providers.JsonRpcProvider(nodeUrl)

export const TEST_TOKEN_DECIMALS = 18
export const TEST_CHAIN_ID = 31

export const getSigner = (index = 0) => provider.getSigner(index)
