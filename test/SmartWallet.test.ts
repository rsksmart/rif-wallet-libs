import { Contract } from 'ethers'
import { deploySmartWalletFactory } from './deploySmartWalletFactory'

describe('SmartWallet', function (this: {
  smartWalletFactoryContract: Contract
}) {
  beforeEach(async () => {
    this.smartWalletFactoryContract = await deploySmartWalletFactory()
  })

  test('asd', () => {
    expect(this.smartWalletFactoryContract.address).toBeDefined()
  })
})
