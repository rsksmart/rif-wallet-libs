import { Wallet } from 'ethers'
import { SmartWallet } from '../src/SmartWallet'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { sendAndWait, createNewTestWallet } from './utils'
import { deploySmartWalletFactory, returnSenderContractFactory, revertsContractFactory } from './contracts'

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

  test('direct send with undefined data', async () => {
    const to = '0x0000000000111111111122222222223333333333'
    const data = undefined
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

  describe('call', () => {
    test('successful', async () => {
      const returnSenderContract = await returnSenderContractFactory.deploy()
      await returnSenderContract.deployTransaction.wait()

      const to = returnSenderContract.address
      const data = returnSenderContract.interface.encodeFunctionData('getSender')
      const calldata = await this.smartWallet.callStaticDirectExecute(to, data)
      const sender = returnSenderContract.interface.decodeFunctionResult('getSender', calldata)[0]
      expect(sender).toEqual(this.smartWallet.smartWalletAddress)
    })

    test('reverting', async () => {
      const revertsContract = await revertsContractFactory.deploy()
      await revertsContract.deployTransaction.wait()

      const to = revertsContract.address
      const data = revertsContract.interface.encodeFunctionData('makeRevert')
      await expect(this.smartWallet.callStaticDirectExecute(to, data)).rejects.toThrow()
    })
  })
})
