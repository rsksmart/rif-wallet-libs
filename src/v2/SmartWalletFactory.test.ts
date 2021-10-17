import { Wallet } from 'ethers'
import { deploySmartWalletFactory } from './deploySmartWalletFactory'
import { SmartWalletFactory } from './SmartWalletFactory'
import * as testCase from './test-case'
import { fundAccount, testJsonRpcProvider } from './testRpcProvider'

describe('SmartWalletFactory', function (this: {
  smartWalletFactory: SmartWalletFactory
}) {
  beforeEach(async () => {
    const wallet = new Wallet(testCase.private_key_testnet_0, testJsonRpcProvider)
    const smartWalletFactoryContract = await deploySmartWalletFactory()
    this.smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
  })

  test('has a smart address', () => {
    expect(this.smartWalletFactory.smartAddress).toBeDefined()
  })

  test('initially should be not deployed', async () => {
    expect(await this.smartWalletFactory.isDeployed()).toBeFalsy()
  })

  test('deploys smart wallet', async () => {
    await fundAccount(await this.smartWalletFactory.smartWalletFactoryContract.signer.getAddress())
    const tx = await this.smartWalletFactory.deploy()
    await tx.wait()
    expect(await this.smartWalletFactory.isDeployed()).toBeTruthy()
  })
})
