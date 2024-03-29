export class PathDerivator {
  purpose: number | string
  coinTypeNumber: number | string
  account: number | string
  changeIndex: number | string = 0

  constructor (
    purpose: number | string,
    coinTypeNumber: number | string,
    account: number | string,
    changeIndex: number | string = 0
  ) {
    this.purpose = purpose
    this.coinTypeNumber = coinTypeNumber
    this.account = account
    this.changeIndex = changeIndex
  }

  getAccountDerivation () {
    return `m/${this.purpose}'/${this.coinTypeNumber}'/${this.account}'`
  }

  getBIP32ExtendedDerivation () {
    return `m/${this.purpose}'/${this.coinTypeNumber}'/${this.account}'/0`
  }

  getAddressDerivation (index: number | string, changeIndex?: number | string) {
    return `m/${this.purpose}'/${this.coinTypeNumber}'/${this.account}'/${changeIndex ?? this.changeIndex}/${index}`
  }
}
