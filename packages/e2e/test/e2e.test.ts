import { Wallet, Contract, BigNumber } from 'ethers'
import { sendAndWait, fundAccount, testJsonRpcProvider, deploySmartWalletFactory, erc677ContractFactory } from '@rsksmart/rif-wallet-test-lib'
import { KeyManagementSystem } from '@rsksmart/rif-wallet-kms'
import { RIFWallet, Request, OnRequest, SendTransactionRequest } from '@rsksmart/rif-wallet-core'

describe('e2e', function (this: {
  smartWalletFactoryContract: Contract
  onRequest: OnRequest
  wallet: Wallet
}) {
  beforeEach(async () => {
    this.smartWalletFactoryContract = await deploySmartWalletFactory()

    // account creation
    const kms = KeyManagementSystem.create()
    const walletRequest = kms.nextWallet(31)

    // user confirmation
    walletRequest.save()

    // funding account
    this.wallet = walletRequest.wallet.connect(testJsonRpcProvider)
    await sendAndWait(fundAccount(this.wallet.address))
  })

  test.skip('send transaction', async () => {
    // user that changes transaction params
    const gasPrice = BigNumber.from('100000')

    const onRequest = ((nextRequest: SendTransactionRequest) => {
      nextRequest.confirm({ gasPrice })
    }) as OnRequest

    const rifWallet = await RIFWallet.create(this.wallet, this.smartWalletFactoryContract.address, onRequest)

    await sendAndWait(rifWallet.smartWalletFactory.deploy())

    // send transaction
    const txRequest = {
      to: '0x0000000000111111111122222222223333333333',
      data: '0x'
    }

    const tx = await rifWallet.sendTransaction(txRequest)

    // transaction is confirmed (mined)
    const receipt = await tx.wait()

    expect(tx.gasPrice).toEqual(gasPrice)
    expect(receipt.status).toBe(1)
  })

  test.skip('contract interaction', async () => {
    const onRequest = (nextRequest: Request) => nextRequest.confirm()
    const rifWallet = await RIFWallet.create(this.wallet, this.smartWalletFactoryContract.address, onRequest)

    await sendAndWait(rifWallet.smartWalletFactory.deploy())

    const initialBalance = BigNumber.from('10000000000000000000') // 10 RIF

    const erc677Contract = await erc677ContractFactory.deploy(
      rifWallet.smartWalletAddress,
      initialBalance,
      'RIF Token',
      'RIF')

    await erc677Contract.deployTransaction.wait()

    const connectedContract = erc677Contract.connect(rifWallet)

    const balance = await connectedContract.balanceOf(rifWallet.smartWalletAddress)

    expect(balance).toEqual(initialBalance)

    const receiver = '0x1111111111222222222233333333334444444444'
    const amount = BigNumber.from('1000000000000000000')

    const tx = await connectedContract.transfer(receiver, amount) // RIF
    await tx.wait()

    expect(await connectedContract.balanceOf(receiver)).toEqual(amount)
  })
})
