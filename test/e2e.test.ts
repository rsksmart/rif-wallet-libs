import { deploySmartWalletFactory, sendAndWait } from "./utils"
import { KeyManagementSystem } from "../src/KeyManagementSystem"
import { SmartWalletFactory } from "../src/SmartWalletFactory"
import { fundAccount, testJsonRpcProvider } from "./utils"

describe('e2e', () => {
  test('local account', async () => {
    const smartWalletFactoryContract = await deploySmartWalletFactory()

    const kms = KeyManagementSystem.create()

    const { wallet, save } = kms.nextWallet(31)
    save()

    await sendAndWait(fundAccount(wallet.address))

    const smartWalletFactory = await SmartWalletFactory.create(wallet.connect(testJsonRpcProvider), smartWalletFactoryContract.address)

    await sendAndWait(smartWalletFactory.deploy())

    expect(await smartWalletFactory.isDeployed()).toBeTruthy()
  })
})
