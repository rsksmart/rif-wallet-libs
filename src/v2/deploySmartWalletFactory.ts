import { Contract, ContractFactory } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from './SmartWalletABI.json'

import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'
import smartWalletFactoryABI from './SmartWalletFactoryABI.json'
import { testAccount } from './testRpcProvider'

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(smartWalletABI, smartWalletBytecode, testAccount)
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(smartWalletFactoryABI, smartWalletFactoryBytecode, testAccount)
  const smartWalletFactoryContract = await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
