import {  Wallet, Contract, constants, ContractTransaction } from 'ethers'
import SmartWalletFactoryABI from './SmartWalletFactoryABI.json'

interface ISmartWallet extends Wallet {
  getSmartAddress(): Promise<string>

  isDeployed(): Promise<boolean>
  deploy(): Promise<ContractTransaction>
}

const createSmartWalletFactoryContract = (address: string) => {
  return new Contract(address, SmartWalletFactoryABI)
}

/**
 * This is a Smart Wallet Factory contract helper for a given Wallet
 */
export class SmartWalletFactory {
  smartAddress: string
  smartWalletFactoryContract: Contract

  private constructor(smartAddress: string, smartWalletFactoryContract: Contract) {
    this.smartAddress = smartAddress
    this.smartWalletFactoryContract = smartWalletFactoryContract
  }

  private static getSmartWalletParams (address: string) {
    return [
      address,
      constants.AddressZero,
      constants.Zero
    ]
  }

  static async create(wallet: Wallet, smartWalletFactoryContractAddress: string) {
    const smartWalletFactoryContract = createSmartWalletFactoryContract(smartWalletFactoryContractAddress).connect(wallet)
    const smartAddress = await smartWalletFactoryContract.getSmartWalletAddress(...SmartWalletFactory.getSmartWalletParams(wallet.address))
    return new SmartWalletFactory(smartAddress, smartWalletFactoryContract)
  }

  // deployment
  getSmartAddress = async (): Promise<string> => this.smartAddress

  isDeployed = async () => this.smartWalletFactoryContract.signer.provider!.getCode(
    await this.smartAddress,
  ).then(code => code !== '0x')

  deploy = () => this.smartWalletFactoryContract.selfCreateUserSmartWallet(
    constants.AddressZero,
    constants.Zero,
  )
}