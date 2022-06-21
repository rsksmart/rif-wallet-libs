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
exports.InjectedBrowserAdapter = void 0
const AccountsResolver_1 = require('./resolvers/AccountsResolver')
const CallsResolver_1 = require('./resolvers/CallsResolver')
const ChainIdResolver_1 = require('./resolvers/ChainIdResolver')
const EstimateGasResolver_1 = require('./resolvers/EstimateGasResolver')
const GetBalanceResolver_1 = require('./resolvers/GetBalanceResolver')
const GetBlockByNumberResolver_1 = require('./resolvers/GetBlockByNumberResolver')
const BlockNumberResolver_1 = require('./resolvers/BlockNumberResolver')
const NetVersionResolver_1 = require('./resolvers/NetVersionResolver')
const PersonalSignResolver_1 = require('./resolvers/PersonalSignResolver')
const RequestAccountsResolver_1 = require('./resolvers/RequestAccountsResolver')
const SendTransactionResolver_1 = require('./resolvers/SendTransactionResolver')
const SignTypedDataResolver_1 = require('./resolvers/SignTypedDataResolver')
const SignTypedDataV4Resolver_1 = require('./resolvers/SignTypedDataV4Resolver')
const GasPriceResolver_1 = require('./resolvers/GasPriceResolver')
const RPCAdapter_1 = require('./RPCAdapter')
const GetTransactionByHashResolver_1 = require('./resolvers/GetTransactionByHashResolver')
const GetTransactionReceiptResolver_1 = require('./resolvers/GetTransactionReceiptResolver')
const InjectedBrowserAdapter = /** @class */ (function (_super) {
  __extends(InjectedBrowserAdapter, _super)
  function InjectedBrowserAdapter (signer) {
    return _super.call(this, [
      new SendTransactionResolver_1.SendTransactionResolver(signer),
      new PersonalSignResolver_1.PersonalSignResolver(signer),
      new SignTypedDataResolver_1.SignTypedDataResolver(signer),
      new SignTypedDataV4Resolver_1.SignTypedDataV4Resolver(signer),
      new AccountsResolver_1.AccountsResolver(signer),
      new RequestAccountsResolver_1.RequestAccountsResolver(signer),
      new ChainIdResolver_1.ChainIdResolver(signer),
      new NetVersionResolver_1.NetVersionResolver(signer),
      new CallsResolver_1.CallsResolver(signer),
      new EstimateGasResolver_1.EstimateGasResolver(signer),
      new GetBalanceResolver_1.GetBalanceResolver(signer),
      new BlockNumberResolver_1.BlockNumberResolver(signer),
      new GetBlockByNumberResolver_1.GetBlockByNumberResolver(signer),
      new GasPriceResolver_1.GasPriceResolver(signer),
      new GetTransactionByHashResolver_1.GetTransactionByHashResolver(signer),
      new GetTransactionReceiptResolver_1.GetTransactionReceiptResolver(signer)
    ]) || this
  }
  return InjectedBrowserAdapter
}(RPCAdapter_1.RPCAdapter))
exports.InjectedBrowserAdapter = InjectedBrowserAdapter
