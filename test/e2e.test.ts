import { deploySmartWalletFactory, sendAndWait, fundAccount, testJsonRpcProvider } from './utils'
import { KeyManagementSystem } from '../src/KeyManagementSystem'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { RIFWallet } from '../src/RIFWallet'

describe('e2e', () => {
  test('local account', async () => {
    const smartWalletFactoryContract = await deploySmartWalletFactory()

    const kms = KeyManagementSystem.create()
    const walletRequest = kms.nextWallet(31)

    walletRequest.save()

    const wallet = walletRequest.wallet.connect(testJsonRpcProvider)
    await sendAndWait(fundAccount(wallet.address))

    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
    await sendAndWait(smartWalletFactory.deploy())

    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const rifWallet = RIFWallet.create(wallet, smartWalletAddress)

    const txRequest = {
      to: '0x0000000000111111111122222222223333333333',
      data: '0xabcd'
    }

    const txPromise = rifWallet.sendTransaction(txRequest)

    rifWallet.nextRequest().confirm()

    const tx = await txPromise
    const receipt = await tx.wait()

    expect(receipt.status).toBe(1)
  })
})
