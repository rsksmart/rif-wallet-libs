'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.formatBigNumber = void 0
const ethers_1 = require('ethers')
const formatBigNumber = function (amount, decimals) {
  if (amount.isZero()) {
    return '0'
  }
  const divisor = ethers_1.BigNumber.from(10).pow(ethers_1.BigNumber.from(decimals))
  const quotient = amount.div(divisor)
  const rest = amount.mod(divisor)
  // https://stackoverflow.com/questions/5774246/remove-trailing-characters-from-string-in-javascript
  return (quotient.toString() +
        (rest.isZero()
          ? ''
          : '.' +
                rest.toString().padStart(decimals, '0').slice(0, 8).replace(/0+$/, '')))
}
exports.formatBigNumber = formatBigNumber
