import { Contract, ContractFactory, Signer } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from './SmartWalletABI.json'

import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'
import smartWalletFactoryABI from './SmartWalletFactoryABI.json'
import { testAccount } from './testRpcProvider'

export const deploySmartWalletFactory = async (signer: Signer): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(smartWalletABI, smartWalletBytecode, signer)
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(smartWalletFactoryABI, smartWalletFactoryBytecode, signer)
  const smartWalletFactoryContract = await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
