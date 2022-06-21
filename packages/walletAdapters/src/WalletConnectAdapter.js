'use strict'
const __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b }) ||
            function (d, b) { for (const p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p] }
    return extendStatics(d, b)
  }
  return function (d, b) {
    if (typeof b !== 'function' && b !== null) { throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null') }
    extendStatics(d, b)
    function __ () { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
  }
})()
Object.defineProperty(exports, '__esModule', { value: true })
exports.WalletConnectAdapter = void 0
const PersonalSignResolver_1 = require('./resolvers/PersonalSignResolver')
const SendTransactionResolver_1 = require('./resolvers/SendTransactionResolver')
const SignTypedDataResolver_1 = require('./resolvers/SignTypedDataResolver')
const RPCAdapter_1 = require('./RPCAdapter')
const WalletConnectAdapter = /** @class */ (function (_super) {
  __extends(WalletConnectAdapter, _super)
  function WalletConnectAdapter (signer) {
    return _super.call(this, [
      new SendTransactionResolver_1.SendTransactionResolver(signer),
      new PersonalSignResolver_1.PersonalSignResolver(signer),
      new SignTypedDataResolver_1.SignTypedDataResolver(signer)
    ]) || this
  }
  return WalletConnectAdapter
}(RPCAdapter_1.RPCAdapter))
exports.WalletConnectAdapter = WalletConnectAdapter
