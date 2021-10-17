import { deploySmartWalletFactory, sendAndWait, createNewTestWallet } from './utils'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { RIFWallet } from '../src/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/abstract-provider'

describe('RIFWallet', function (this: {
  rifWallet: RIFWallet
}) {
  beforeEach(async () => {
    const wallet = await createNewTestWallet()

    const smartWalletFactoryContract = await deploySmartWalletFactory()

    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
    await sendAndWait(smartWalletFactory.deploy())

    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()

    this.rifWallet = await RIFWallet.create(wallet, smartWalletAddress)
  })

  test('uses smart address', async () => {
    expect(await this.rifWallet.getAddress()).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
  })

  describe('send transaction', () => {
    test('uses direct send', async () => {
      const txRequest = {
        to: '0x0000000000111111111122222222223333333333',
        data: '0xabcd'
      }

      const tx = await this.rifWallet.sendTransaction(txRequest)
      await tx.wait()

      expect(tx.to).toEqual(this.rifWallet.smartWalletAddress)
      expect(tx.data).toContain('0000000000111111111122222222223333333333')
      expect(tx.data).toContain('abcd')
    })

    test('allows to override params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const txRequest: TransactionRequest = {
        to: '0x0000000000111111111122222222223333333333',
        data: '0xabcd',
        gasPrice,
        gasLimit
      }

      const tx = await this.rifWallet.sendTransaction(txRequest)
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })
  })
})
