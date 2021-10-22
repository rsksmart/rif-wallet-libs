import { BigNumber } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { filterTxOptions } from '../src/filterTxOptions'

test('filterTxOptions', () => {
  const txOptions: Partial<TransactionRequest> = {
    gasPrice: BigNumber.from('10'),
    gasLimit: BigNumber.from('10'),
    value: BigNumber.from('10')
  }

  const txRequest: TransactionRequest = {
    from: '0xabcd',
    to: '0xabcd',
    data: '0xabcd',
    ...txOptions
  }

  const filteredTxRequest = filterTxOptions(txRequest)

  expect(filteredTxRequest).toEqual(txOptions)
})
