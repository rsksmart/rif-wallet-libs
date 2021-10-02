import { Wallet } from '../src/Wallet'

// test case - do not reuse
const mnemonic = 'stock potato vanish horn pattern piece decade tent month decrease mansion only pond enough bar boy lemon select depart bleak diagram creek maximum neglect'
const private_key_testnet_0 = '66863843044406245f2352e8bd93e5cd6304c5c6f14909b65249b186af1b9deb'
const private_key_testnet_1 = 'b87803c196f7dd8fc506304de3f8d172fc26055d3b67671d8f623d780b70af21'

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

  describe('derives accounts', () => {
    test('creates a private key for an account', () => {
      const wallet = new Wallet({ mnemonic })
      const account = wallet.getAccount(0)
      expect(account.privateKey).toEqual(private_key_testnet_0)
    })

    test('creates the tree of private keys', () => {
      const wallet = new Wallet({ mnemonic })
      const account = wallet.getAccount(1)
      expect(account.privateKey).toEqual(private_key_testnet_1)
    })
  })
})
