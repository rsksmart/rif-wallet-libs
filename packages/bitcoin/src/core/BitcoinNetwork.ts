import { BIP39 } from './BIP39'
import { NETWORK_DATA } from '../constants'
import { BIP } from './BIP'
import { createBipFactory } from '../factories/BIPFactory'

export class BitcoinNetwork {
  networkId: string
  networkName!: string
  coinTypeNumber!: number
  bipNames: { [key: string]: BIP } = {}
  seed: Buffer
  BIPFactory: typeof createBipFactory
  bips: Array<BIP> = []
  balance = 0
  satoshis = 0
  contractAddress: string
  symbol!: string
  decimals = 8
  constructor (
    networkId: string,
    bipNames: Array<string> = [],
    mnemonic: string,
    bipFactory = createBipFactory
  ) {
    this.networkId = networkId
    this.contractAddress = networkId
    this.seed = new BIP39(mnemonic).seed
    this.BIPFactory = bipFactory
    this.setCoinConfiguration()
    if (bipNames.length === 0) {
      throw new Error('You must define a BIP for this Network')
    }
    this.setBips(bipNames)
    this.updateBalance()
  }

  setCoinConfiguration () {
    this.coinTypeNumber = NETWORK_DATA[this.networkId].coinTypeNumber
    this.networkName = NETWORK_DATA[this.networkId].networkName
    this.symbol = NETWORK_DATA[this.networkId].symbol
  }

  setBips (bips: Array<string>) {
    let counter = 0
    for (const bipName of bips) {
      const BIPInstance = this.BIPFactory(
        this,
        bipName,
        this.seed
      )
      this.bipNames[counter] = BIPInstance
      this.bipNames[bipName] = BIPInstance
      this.bips.push(BIPInstance)
      counter++
    }
  }

  async updateBalance () {
    const balances = this.bips.map(bip => bip.fetchBalance())
    await Promise.all(balances)
    let satoshis = 0
    let balance = 0
    for (const bip of this.bips) {
      satoshis += Number(bip.balance) || 0
      balance += bip.btc
    }
    this.satoshis = satoshis
    this.balance = balance
    return this.balance
  }
}
