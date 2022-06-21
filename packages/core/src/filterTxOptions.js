'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.filterTxOptions = void 0
const filterTxOptions = function (transactionRequest) {
  return Object.keys(transactionRequest)
    .filter(function (key) { return !['from', 'to', 'data'].includes(key) })
    .reduce(function (obj, key) {
      obj[key] = transactionRequest[key]
      return obj
    }, {})
}
exports.filterTxOptions = filterTxOptions
