import { Wallet } from '../src/Wallet'

// test case - do not reuse
const mnemonic = 'stock potato vanish horn pattern piece decade tent month decrease mansion only pond enough bar boy lemon select depart bleak diagram creek maximum neglect'

describe('RIFWallet', () => {
  describe('create a wallet', () => {
    test('wallets have a 24 word mneomnic', () => {
      const wallet = Wallet.create()
      expect(wallet.mnemonic.split(' ')).toHaveLength(24)
    })

    test('creates different wallets', () => {
      const wallet = Wallet.create()
      const anotherWallet = Wallet.create()
      expect(wallet.mnemonic).not.toEqual(anotherWallet.mnemonic)
    })
  })

  describe('import wallet', () => {
    test('imports a wallet given a mnemonic', () => {
      const wallet = new Wallet({ mnemonic })
      expect(wallet.mnemonic).toEqual(mnemonic)
    })
  })
})
