import { deploySmartWalletFactory, sendAndWait, createNewTestWallet, testJsonRpcProvider, returnSenderContractFactory, wasteGasContractFactory } from './utils'
import { Request, RIFWallet } from '../src/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/abstract-provider'

const txRequest = {
  to: '0x0000000000111111111122222222223333333333',
  data: '0xabcd'
}

describe('RIFWallet', function (this: {
  rifWallet: RIFWallet
  onRequest: ReturnType<typeof jest.fn>
}) {
  beforeEach(async () => {
    const wallet = await createNewTestWallet()

    const smartWalletFactoryContract = await deploySmartWalletFactory()

    this.onRequest = jest.fn()
    this.rifWallet = await RIFWallet.create(wallet, smartWalletFactoryContract.address, this.onRequest)

    await sendAndWait(this.rifWallet.smartWalletFactory.deploy())
  })

  test('uses smart address', async () => {
    expect(this.rifWallet.address).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
    expect(await this.rifWallet.getAddress()).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
  })

  describe('send transaction', () => {
    test('uses direct send', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)
      this.rifWallet.nextRequest().confirm()
      const tx = await txPromise
      await tx.wait()

      expect(tx.to).toEqual(this.rifWallet.smartWalletAddress)
      expect(tx.data).toContain('0000000000111111111122222222223333333333')
      expect(tx.data).toContain('abcd')
    })

    test('allows to override params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const overriddenTxRequest: TransactionRequest = {
        ...txRequest,
        gasPrice,
        gasLimit
      }

      const txPromise = this.rifWallet.sendTransaction(overriddenTxRequest)
      this.rifWallet.nextRequest().confirm()
      const tx = await txPromise
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })
  })

  describe('queue', () => {
    test('is initially mepty', () => {
      expect(() => this.rifWallet.nextRequest()).toThrow()
    })

    test('queues a transaction', async () => {
      this.rifWallet.sendTransaction(txRequest)

      expect(this.rifWallet.nextRequest().type).toEqual('sendTransaction')
    })

    test('cannot send a transaction when another is pending (for now, this should be a queue)', async () => {
      this.rifWallet.sendTransaction(txRequest)

      expect(this.rifWallet.sendTransaction(txRequest)).rejects.toThrow()
    })

    test('can reject a tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().reject()

      await expect(txPromise).rejects.toThrow()
    })

    test('can confirm a tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx = await txPromise
      await tx.wait()

      // first is the deploy, second this tx
      expect(await testJsonRpcProvider.getTransactionCount(this.rifWallet.smartWallet.wallet.address)).toEqual(2)
    })

    test('can do more than one tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx = await txPromise
      await tx.wait()

      const txPromise2 = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx2 = await txPromise2
      await tx2.wait()

      // first is the deploy, second this tx
      expect(await testJsonRpcProvider.getTransactionCount(this.rifWallet.smartWallet.wallet.address)).toEqual(3)
    })

    test('can modify tx params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const txPromise = this.rifWallet.sendTransaction(txRequest)

      const nextRequest = this.rifWallet.nextRequest()
      nextRequest.payload.transactionRequest.gasPrice = gasPrice
      nextRequest.payload.transactionRequest.gasLimit = gasLimit
      nextRequest.confirm()

      const tx = await txPromise
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })

    test('cannot edit the next request, only the params of the payload', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      const nextRequest = this.rifWallet.nextRequest()
      expect(() => { nextRequest.confirm = (v) => {} }).toThrow()
      expect(() => { nextRequest.reject = (v) => {} }).toThrow()
      expect(() => { nextRequest.type = 'sendTransaction' }).toThrow()
      expect(() => { nextRequest.payload = {} as any }).toThrow()

      this.rifWallet.nextRequest().reject() // close handle
      await expect(txPromise).rejects.toThrow()
    })
  })

  describe('onRequest', () => {
    test('is called with a new sendTransaction', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      expect(this.onRequest).toHaveBeenCalledWith(this.rifWallet.nextRequest())

      this.rifWallet.nextRequest().reject() // close handle
      await expect(txPromise).rejects.toThrow()
    })
  })

  describe('contracts', () => {
    test('calls via smart wallet', async () => {
      const returnSenderContract = await returnSenderContractFactory.deploy()
      await returnSenderContract.deployTransaction.wait()

      const connected = returnSenderContract.connect(this.rifWallet)

      const sender = await connected.getSender()

      expect(sender).toEqual(this.rifWallet.smartWalletAddress)
    })

    test('passes blockTag', async () => {
      const returnSenderContract = await returnSenderContractFactory.deploy()
      await returnSenderContract.deployTransaction.wait()

      const connected = returnSenderContract.connect(this.rifWallet)

      await expect(
        connected.getSender({ blockTag: BigNumber.from('0') }) // contract was not created at this moment
      ).rejects.toThrow()
    })

    test('sends via smart wallet', async () => {
      const wasteGasContract = await wasteGasContractFactory.deploy()
      await wasteGasContract.deployTransaction.wait()

      const onRequest = (nextRequest: Request) => {
        expect(nextRequest.payload.transactionRequest.to).toEqual(wasteGasContract.address)
        expect(nextRequest.payload.transactionRequest.data).toEqual(wasteGasContract.interface.encodeFunctionData('wasteGas'))

        nextRequest.confirm()
      }

      const rifWallet = await RIFWallet.create(this.rifWallet.wallet, this.rifWallet.smartWalletFactory.smartWalletFactoryContract.address, onRequest)

      const connected = wasteGasContract.connect(rifWallet)

      const tx = await connected.wasteGas()
      await tx.wait()

      expect(tx.to).toEqual(rifWallet.smartWalletAddress)

      const smartTx = rifWallet.smartWallet.smartWalletContract.interface.decodeFunctionData('directExecute', tx.data)
      expect(smartTx.to).toEqual(wasteGasContract.address)
      expect(smartTx.data).toEqual(wasteGasContract.interface.encodeFunctionData('wasteGas'))
    })
  })
})
