import { deploySmartWalletFactory, sendAndWait, createNewTestWallet, returnSenderContractFactory } from './utils'
import { SmartWallet } from '../src/SmartWallet'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { Wallet } from '@ethersproject/wallet'

describe('SmartWallet', function (this: {
  wallet: Wallet
  smartWalletAddress: string
  smartWallet: SmartWallet
}) {
  beforeEach(async () => {
    this.wallet = await createNewTestWallet()

    const smartWalletFactoryContract = await deploySmartWalletFactory()

    const smartWalletFactory = await SmartWalletFactory.create(this.wallet, smartWalletFactoryContract.address)
    await sendAndWait(smartWalletFactory.deploy())

    this.smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    this.smartWallet = await SmartWallet.create(this.wallet, this.smartWalletAddress)
  })

  test('addresses', async () => {
    expect(await this.smartWallet.address).toEqual(this.wallet.address)
    expect(await this.smartWallet.smartWalletAddress).toEqual(this.smartWalletAddress)
  })

  test('direct send', async () => {
    const to = '0x0000000000111111111122222222223333333333'
    const data = '0xabcd'
    await sendAndWait(this.smartWallet.directExecute(to, data))
    expect(await this.smartWallet.wallet.getTransactionCount()).toEqual(2)
  })

  test('estimate direct send', async () => {
    const to = '0x0000000000111111111122222222223333333333'
    const data = '0xabcd'
    const gasLimit = await this.smartWallet.estimateDirectExecute(to, data)
    await sendAndWait(this.smartWallet.directExecute(to, data, { gasLimit }))
    expect(await this.smartWallet.wallet.getTransactionCount()).toEqual(2)
  })

  test('call via direct send', async () => {
    const returnSenderContract = await returnSenderContractFactory.deploy()
    await returnSenderContract.deployTransaction.wait()

    const to = returnSenderContract.address
    const data = returnSenderContract.interface.encodeFunctionData('getSender')
    const returnData = await this.smartWallet.callStaticDirectExecute(to, data)
    const sender = returnSenderContract.interface.decodeFunctionResult('getSender', returnData[1])[0]
    expect(sender).toEqual(this.smartWallet.smartWalletAddress)
  })
})
