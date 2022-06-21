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
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i]
      for (const p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) { t[p] = s[p] }
      }
    }
    return t
  }
  return __assign.apply(this, arguments)
}
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1] }, trys: [], ops: [] }; let f; let y; let t; let g
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this }), g
  function verb (n) { return function (v) { return step([n, v]) } }
  function step (op) {
    if (f) throw new TypeError('Generator is already executing.')
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t
        if (y = 0, t) op = [op[0] & 2, t.value]
        switch (op[0]) {
          case 0: case 1: t = op; break
          case 4: _.label++; return { value: op[1], done: false }
          case 5: _.label++; y = op[1]; op = [0]; continue
          case 7: op = _.ops.pop(); _.trys.pop(); continue
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break }
            if (t[2]) _.ops.pop()
            _.trys.pop(); continue
        }
        op = body.call(thisArg, _)
      } catch (e) { op = [6, e]; y = 0 } finally { f = t = 0 }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true }
  }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.RIFWallet = void 0
const ethers_1 = require('ethers')
const properties_1 = require('@ethersproject/properties')
const utils_1 = require('ethers/lib/utils')
const SmartWalletFactory_1 = require('./SmartWalletFactory')
const SmartWallet_1 = require('./SmartWallet')
const filterTxOptions_1 = require('./filterTxOptions')
const RIFWallet = /** @class */ (function (_super) {
  __extends(RIFWallet, _super)
  function RIFWallet (smartWalletFactory, smartWallet, onRequest) {
    const _this = _super.call(this) || this
    _this.getAddress = function () { return Promise.resolve(_this.smartWallet.smartWalletAddress) }
    _this.signTransaction = function (transaction) { return _this.smartWallet.signer.signTransaction(transaction) }
    _this.createDoRequest = function (type, onConfirm) {
      return function () {
        const payload = []
        for (let _i = 0; _i < arguments.length; _i++) {
          payload[_i] = arguments[_i]
        }
        return new Promise(function (resolve, reject) {
          const nextRequest = Object.freeze({
            type: type,
            payload: payload,
            confirm: function (args) { return resolve(onConfirm(payload, args)) },
            reject: reject
          })
          // emits onRequest
          _this.onRequest(nextRequest)
        })
      }
    }
    _this.sendTransaction = _this.createDoRequest('sendTransaction', function (_a, overriddenOptions) {
      let _b
      const transactionRequest = _a[0]
      const txOptions = __assign(__assign({}, (0, filterTxOptions_1.filterTxOptions)(transactionRequest)), overriddenOptions || {})
      return _this.smartWallet.directExecute(transactionRequest.to, (_b = transactionRequest.data) !== null && _b !== void 0 ? _b : ethers_1.constants.HashZero, txOptions)
    })
    _this.signMessage = _this.createDoRequest('signMessage', function (_a) {
      const message = _a[0]
      return _this.smartWallet.signer.signMessage(message)
    })
    _this._signTypedData = _this.createDoRequest('signTypedData', function (args) {
      let _a
      return (_a = _this.smartWallet.signer)._signTypedData.apply(_a, args)
    })
    _this.connect = function (provider) {
      throw new Error('Method not implemented')
    }
    _this.smartWalletFactory = smartWalletFactory
    _this.smartWallet = smartWallet
    _this.onRequest = onRequest;
    (0, properties_1.defineReadOnly)(_this, 'provider', _this.smartWallet.signer.provider) // ref: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-signer/src.ts/index.ts#L130
    return _this
  }
  Object.defineProperty(RIFWallet.prototype, 'address', {
    get: function () {
      return this.smartWallet.address
    },
    enumerable: false,
    configurable: true
  })
  Object.defineProperty(RIFWallet.prototype, 'smartWalletAddress', {
    get: function () {
      return this.smartWallet.smartWalletAddress
    },
    enumerable: false,
    configurable: true
  })
  RIFWallet.create = function (signer, smartWalletFactoryAddress, onRequest) {
    return __awaiter(this, void 0, void 0, function () {
      let smartWalletFactory, smartWalletAddress, smartWallet
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /* yield */, SmartWalletFactory_1.SmartWalletFactory.create(signer, smartWalletFactoryAddress)]
          case 1:
            smartWalletFactory = _a.sent()
            return [4 /* yield */, smartWalletFactory.getSmartWalletAddress()]
          case 2:
            smartWalletAddress = _a.sent()
            return [4 /* yield */, SmartWallet_1.SmartWallet.create(signer, smartWalletAddress)]
          case 3:
            smartWallet = _a.sent()
            return [2 /* return */, new RIFWallet(smartWalletFactory, smartWallet, onRequest)]
        }
      })
    })
  }
  // calls via smart wallet
  RIFWallet.prototype.call = function (transactionRequest, blockTag) {
    return this.smartWallet.callStaticDirectExecute(transactionRequest.to, transactionRequest.data, __assign(__assign({}, (0, filterTxOptions_1.filterTxOptions)(transactionRequest)), { blockTag: blockTag }))
  }
  RIFWallet.prototype.estimateGas = function (transaction) {
    const _this = this
    return (0, utils_1.resolveProperties)(this.checkTransaction(transaction))
      .then(function (tx) { return _this.smartWallet.estimateDirectExecute(tx.to || ethers_1.constants.AddressZero, tx.data || ethers_1.constants.HashZero, (0, filterTxOptions_1.filterTxOptions)(tx)) })
  }
  return RIFWallet
}(ethers_1.Signer))
exports.RIFWallet = RIFWallet
