
import { Contract, ContractFactory } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from '../src/SmartWalletABI.json'

import smartWalletFactoryABI from '../src/SmartWalletFactoryABI.json'
import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'

import ERC677ABI from './ERC677ABI.json'
import ERC677Bytecode from './ERC677Bytecode.json'

import { rpcAccount } from './utils'

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(smartWalletABI, smartWalletBytecode, rpcAccount)
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(smartWalletFactoryABI, smartWalletFactoryBytecode, rpcAccount)
  const smartWalletFactoryContract = await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}

export const returnSenderContractFactory = new ContractFactory([
  {
    constant: true,
    inputs: [],
    name: 'getSender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
], '0x608060405234801561001057600080fd5b5060b28061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635e01eb5a14602d575b600080fd5b60336075565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60003390509056fea265627a7a723158206474b02d75ef54f55328b06e0c15c762d1f7515c46b8a2deef03acc675f28c1464736f6c63430005100032', rpcAccount)

export const wasteGasContractFactory = new ContractFactory([
  {
    constant: false,
    inputs: [],
    name: 'wasteGas',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
], '0x608060405260008055348015601357600080fd5b506096806100226000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633b6a02f614602d575b600080fd5b60336035565b005b60008090505b60c8811015605e578060008082825401925050819055508080600101915050603b565b5056fea265627a7a72315820dc4943905a3c2af2a2fdba0c68218f4ff91bf1f1441be84cdf23a88ba1d01b9764736f6c63430005100032', rpcAccount)

export const revertsContractFactory = new ContractFactory([
  {
    constant: true,
    inputs: [],
    name: 'makeRevert',
    outputs: [],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  }
], '0x6080604052348015600f57600080fd5b50606f80601d6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632517ecb114602d575b600080fd5b60336035565b005b600080fdfea265627a7a72315820286f44ff552edf0267399dc5e456c57805042b05cfc57c516263aaef546d4f2e64736f6c63430005100032', rpcAccount)

export const erc677ContractFactory = new ContractFactory(ERC677ABI, ERC677Bytecode, rpcAccount)
