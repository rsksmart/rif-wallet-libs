import { BigNumber, ContractReceipt, ContractTransaction, providers, Wallet } from 'ethers'

const nodeUrl = 'http://localhost:8545'

export const testJsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)

export const sendAndWait = async (tx: Promise<ContractTransaction>): Promise<ContractReceipt> => {
  return await (await tx).wait()
}

export const fundAccount = (to: string) => rpcAccount.sendTransaction({
  to,
  value: BigNumber.from('1000000000000000000')
})

export const createNewTestWallet = async () => {
  const wallet = Wallet.createRandom().connect(testJsonRpcProvider)
  await sendAndWait(fundAccount(wallet.address))
  return wallet
}

export const TEST_TOKEN_DECIMALS = 18
export const TEST_CHAIN_ID = 31

export const getSigner = (index = 0) => {
  return testJsonRpcProvider.getSigner(index)
}

export const rpcAccount = getSigner()
