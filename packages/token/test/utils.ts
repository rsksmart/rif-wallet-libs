import { JsonRpcProvider } from '@ethersproject/providers'

const nodeUrl = 'http://localhost:8545'
const provider = new JsonRpcProvider(nodeUrl)

export const TEST_TOKEN_DECIMALS = 18
export const TEST_CHAIN_ID = 31

export const getSigner = (index = 0) => provider.getSigner(index)
