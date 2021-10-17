import { Wallet, Contract, Overrides, ContractTransaction } from "ethers"
import SmartWalletABI from './SmartWalletABI.json'

const createSmartWalletContract = (address: string) => {
  return new Contract(address, SmartWalletABI)
}

export class SmartWallet {
  smartWalletContract: Contract

  private constructor(smartWalletContract: Contract) {
    this.smartWalletContract = smartWalletContract
  }

  static create(wallet: Wallet, smartWalletAddress: string) {
    const smartWalletContract = createSmartWalletContract(smartWalletAddress).connect(wallet)
    return new SmartWallet(smartWalletContract)
  }

  getAddress = (): Promise<string> => Promise.resolve((this.smartWalletContract.signer as Wallet).address)
  getSmartWalletAddress = (): Promise<string> => Promise.resolve(this.smartWalletContract.address)

  directExecute = (to: string, data: string): Promise<ContractTransaction> => this.smartWalletContract.directExecute(to, data)
}
