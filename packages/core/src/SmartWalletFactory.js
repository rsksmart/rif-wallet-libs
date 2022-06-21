'use strict'
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
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.SmartWalletFactory = void 0
const ethers_1 = require('ethers')
const SmartWalletFactoryABI_json_1 = __importDefault(require('./SmartWalletFactoryABI.json'))
const createSmartWalletFactoryContract = function (address) {
  return new ethers_1.Contract(address, SmartWalletFactoryABI_json_1.default)
}
/**
 * This is a Smart Wallet Factory contract helper for a given Wallet
 */
const SmartWalletFactory = /** @class */ (function () {
  function SmartWalletFactory (smartAddress, smartWalletFactoryContract) {
    const _this = this
    // deployment
    this.getSmartWalletAddress = function () { return Promise.resolve(_this.smartAddress) }
    this.isDeployed = function () { return _this.smartWalletFactoryContract.signer.provider.getCode(_this.smartAddress).then(function (code) { return code !== '0x' }) }
    this.deploy = function () { return _this.smartWalletFactoryContract.selfCreateUserSmartWallet(ethers_1.constants.AddressZero, ethers_1.constants.Zero) }
    this.smartAddress = smartAddress
    this.smartWalletFactoryContract = smartWalletFactoryContract
  }
  SmartWalletFactory.getSmartWalletParams = function (address) {
    return [
      address,
      ethers_1.constants.AddressZero,
      ethers_1.constants.Zero
    ]
  }
  SmartWalletFactory.create = function (signer, smartWalletFactoryContractAddress) {
    return __awaiter(this, void 0, void 0, function () {
      let smartWalletFactoryContract, address, smartWalletAddress
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            smartWalletFactoryContract = createSmartWalletFactoryContract(smartWalletFactoryContractAddress).connect(signer)
            return [4 /* yield */, signer.getAddress()]
          case 1:
            address = _a.sent()
            return [4 /* yield */, smartWalletFactoryContract.getSmartWalletAddress.apply(smartWalletFactoryContract, SmartWalletFactory.getSmartWalletParams(address))]
          case 2:
            smartWalletAddress = _a.sent()
            return [2 /* return */, new SmartWalletFactory(smartWalletAddress, smartWalletFactoryContract)]
        }
      })
    })
  }
  return SmartWalletFactory
}())
exports.SmartWalletFactory = SmartWalletFactory
