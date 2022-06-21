'use strict'
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
exports.ERC20EnhanceStrategy = void 0
const types_1 = require('../../../token/src/types')
const tokenMetadata_1 = require('../../../token/src/tokenMetadata')
const formatBigNumber_1 = require('../formatBigNumber')
const bignumber_1 = require('@ethersproject/bignumber')
const ERC20EnhanceStrategy = /** @class */ (function () {
  function ERC20EnhanceStrategy () {
  }
  ERC20EnhanceStrategy.prototype.parse = function (signer, transactionRequest) {
    return __awaiter(this, void 0, void 0, function () {
      let tokens, tokenFounded, abiErc20Interface, resultTo, resultValue, _a, decodedTo, decodedValue, currentBalance, tokenDecimals, tokenSymbol
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!transactionRequest.data) {
              return [2 /* return */, null]
            }
            return [4 /* yield */, (0, tokenMetadata_1.getAllTokens)(signer)
              // TODO: mixed up logic, needs refactor
            ]
          case 1:
            tokens = _b.sent()
            tokenFounded = tokens.find(function (x) { let _a; return x.address.toLowerCase() === ((_a = transactionRequest.to) === null || _a === void 0 ? void 0 : _a.toLowerCase()) })
            if (!tokenFounded) {
              return [2 /* return */, null]
            }
            abiErc20Interface = types_1.ERC20__factory.createInterface()
            resultTo = transactionRequest.to
            resultValue = transactionRequest.value
            try {
              _a = abiErc20Interface.decodeFunctionData('transfer', transactionRequest.data), decodedTo = _a[0], decodedValue = _a[1]
              resultTo = decodedTo
              resultValue = decodedValue
            } catch (error) { }
            return [4 /* yield */, tokenFounded.balance()]
          case 2:
            currentBalance = _b.sent()
            return [4 /* yield */, tokenFounded.decimals()]
          case 3:
            tokenDecimals = _b.sent()
            tokenSymbol = tokenFounded.symbol
            return [2 /* return */, __assign(__assign({}, transactionRequest), { to: resultTo, symbol: tokenSymbol, balance: (0, formatBigNumber_1.formatBigNumber)(currentBalance, tokenDecimals), value: (0, formatBigNumber_1.formatBigNumber)(bignumber_1.BigNumber.from(resultValue !== null && resultValue !== void 0 ? resultValue : 0), tokenDecimals) })]
        }
      })
    })
  }
  return ERC20EnhanceStrategy
}())
exports.ERC20EnhanceStrategy = ERC20EnhanceStrategy
