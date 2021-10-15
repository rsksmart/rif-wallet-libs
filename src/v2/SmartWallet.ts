import { Wallet, Contract, constants } from 'ethers'

export class SmartWallet extends Wallet {
  smartWalletFactory: Contract

  constructor ({ smartWalletFactory }: {
    smartWalletFactory: Contract
  }, ...params: ConstructorParameters<typeof Wallet>) {
    super(...params)
    this.smartWalletFactory = smartWalletFactory
  }

  private async getSmartWalletParams () {
    return [
      this.address,
      constants.AddressZero,
      constants.Zero
    ]
  }

  getSmartAddress = async () => this.smartWalletFactory.getSmartWalletAddress(...await this.getSmartWalletParams())
}
