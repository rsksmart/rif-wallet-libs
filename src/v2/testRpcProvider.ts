import { providers, BigNumber } from 'ethers'

const nodeUrl = 'http://localhost:8545'
export const testJsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)
export const testAccount = testJsonRpcProvider.getSigner(0)

export const fundAccount = (to: string) => testAccount.sendTransaction({
  to,
  value: BigNumber.from('1000000000000000000')
})
