import { RIFWallet } from '../src'

describe('RIFWallet', () => {
  test('RIFWallet', () => {
    const template = new RIFWallet()
    expect(template).toBeDefined()
  })
})
