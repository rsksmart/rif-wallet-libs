import { Contract, ContractFactory } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from '../src/v2/SmartWalletABI.json'

import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'
import smartWalletFactoryABI from '../src/v2/SmartWalletFactoryABI.json'
import { jsonRpcProvider } from './testRpcProvider'

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const signer = jsonRpcProvider.getSigner()

  const smartWalletContractFactory = new ContractFactory(smartWalletABI, smartWalletBytecode, signer)
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(smartWalletFactoryABI, smartWalletFactoryBytecode, signer)
  const smartWalletFactoryContract = await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
