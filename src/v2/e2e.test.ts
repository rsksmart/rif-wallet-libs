import { deploySmartWalletFactory } from "./deploySmartWalletFactory"
import { KeyManagementSystem } from "./KeyManagementSystem"
import { SmartWalletFactory } from "./SmartWalletFactory"
import { fundAccount, testAccount, testJsonRpcProvider } from "./testRpcProvider"

describe('e2e', () => {
  test('local account', async () => {
    const smartWalletFactoryContract = await deploySmartWalletFactory(testAccount)

    const kms = KeyManagementSystem.create()

    const { wallet, save } = kms.nextWallet(31)
    save()

    await fundAccount(wallet.address)

    const smartWalletFactory = await SmartWalletFactory.create(wallet.connect(testJsonRpcProvider), smartWalletFactoryContract.address)

    const tx = await smartWalletFactory.deploy()

    await tx.wait()

    expect(await smartWalletFactory.isDeployed()).toBeTruthy()
  })
})
