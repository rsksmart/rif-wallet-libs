import { BigNumber } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { OnRequest, Request, RIFWallet } from '../src/RIFWallet'
import { createNewTestWallet } from './utils'
import { returnSenderContractFactory, wasteGasContractFactory, deploySmartWalletFactory } from './contracts'

const txRequest: TransactionRequest = {
  to: '0x0000000000111111111122222222223333333333',
  data: '0xabcd'
}

const voidOnRequest = () => {}

const confirmOnRequest = (nextRequest: Request) => {
  nextRequest.confirm()
}

const rejectOnRequestError = 'Rejected'
const rejectOnRequest = (nextRequest: Request) => {
  nextRequest.reject(rejectOnRequestError)
}

describe('RIFWallet', function (this: {
  createRIFWallet: (onRequest: OnRequest) => Promise<RIFWallet>
  rifWallet: RIFWallet
}) {
  beforeEach(async () => {
    const wallet = await createNewTestWallet()

    const smartWalletFactoryContract = await deploySmartWalletFactory()

    this.createRIFWallet = async (onRequest: OnRequest) => {
      const rifWallet = await RIFWallet.create(wallet, smartWalletFactoryContract.address, onRequest)
      const tx = await rifWallet.smartWalletFactory.deploy()
      await tx.wait()
      return rifWallet
    }
  })

  describe('setup', () => {
    beforeEach(async () => {
      this.rifWallet = await this.createRIFWallet(voidOnRequest)
    })

    test('uses smart address', async () => {
      expect(this.rifWallet.address).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
      expect(await this.rifWallet.getAddress()).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
    })

    test('sets provider prop', async () => {
      const chainId = await this.rifWallet.getChainId()

      expect(chainId).toEqual(1337)
    })

    test('cannot connect a new provider', () => {
      expect(() => this.rifWallet.connect({} as any)).toThrow()
    })
  })

  describe('onRequest', () => {
    test('gets tx params', async (done) => {
      const onRequest = (nextRequest: Request) => {
        expect(nextRequest.payload.transactionRequest.to).toEqual(txRequest.to)
        expect(nextRequest.payload.transactionRequest.data).toEqual(txRequest.data)

        done()
      }

      const rifWallet = await this.createRIFWallet(onRequest)

      await rifWallet.sendTransaction(txRequest)
    })

    test('has type \'sendTransaction\'', async (done) => {
      const onRequest = (nextRequest: Request) => {
        expect(nextRequest.type).toEqual('sendTransaction')
        done()
      }

      const rifWallet = await this.createRIFWallet(onRequest)

      await rifWallet.sendTransaction(txRequest)
    })

    test('can confirm', async () => {
      const rifWallet = await this.createRIFWallet(confirmOnRequest)

      const tx = await rifWallet.sendTransaction(txRequest)

      const receipt = await tx.wait()

      expect(receipt.status).toEqual(1)
    })

    test('can reject with given reason', async () => {
      const rifWallet = await this.createRIFWallet(rejectOnRequest)

      await expect(rifWallet.sendTransaction(txRequest)).rejects.toThrowError(rejectOnRequestError)
    })

    test('cannot edit the request', async (done) => {
      const onRequest = (nextRequest: Request) => {
        expect(() => { nextRequest.confirm = (v) => {} }).toThrow()
        expect(() => { nextRequest.reject = (v) => {} }).toThrow()
        expect(() => { nextRequest.type = 'sendTransaction' }).toThrow()
        expect(() => { nextRequest.payload = {} as any }).toThrow()

        done()
      }

      const rifWallet = await this.createRIFWallet(onRequest)

      await rifWallet.sendTransaction(txRequest)
    })
  })

  describe('send transaction', () => {
    test('uses direct send', async () => {
      const rifWallet = await this.createRIFWallet(confirmOnRequest)
      const tx = await rifWallet.sendTransaction(txRequest)
      await tx.wait()

      expect(tx.to).toEqual(rifWallet.smartWalletAddress)

      const smartTx = rifWallet.smartWallet.smartWalletContract.interface.decodeFunctionData('directExecute', tx.data)
      expect(smartTx.to).toEqual(txRequest.to)
      expect(smartTx.data).toEqual(txRequest.data)
    })

    test('can edit tx params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const onRequest = (nextRequest: Request) => {
        nextRequest.payload.transactionRequest.gasPrice = gasPrice
        nextRequest.payload.transactionRequest.gasLimit = gasLimit
        nextRequest.confirm()
      }

      const rifWallet = await this.createRIFWallet(onRequest)

      const tx = await rifWallet.sendTransaction(txRequest)
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })
  })

  describe('contracts', () => {
    describe('call', () => {
      beforeEach(async () => {
        this.rifWallet = await this.createRIFWallet(voidOnRequest)
      })

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
