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
exports.erc677ContractFactory = exports.revertsContractFactory = exports.wasteGasContractFactory = exports.returnSenderContractFactory = exports.deploySmartWalletFactory = void 0
const ethers_1 = require('ethers')
const SmartWalletBytecode_json_1 = __importDefault(require('./SmartWalletBytecode.json'))
const SmartWalletABI_json_1 = __importDefault(require('../src/SmartWalletABI.json'))
const SmartWalletFactoryABI_json_1 = __importDefault(require('../src/SmartWalletFactoryABI.json'))
const SmartWalletFactoryBytecode_json_1 = __importDefault(require('./SmartWalletFactoryBytecode.json'))
const ERC677ABI_json_1 = __importDefault(require('./ERC677ABI.json'))
const ERC677Bytecode_json_1 = __importDefault(require('./ERC677Bytecode.json'))
const utils_1 = require('./utils')
const deploySmartWalletFactory = function () {
  return __awaiter(void 0, void 0, void 0, function () {
    let smartWalletContractFactory, smartWalletContract, smartWalletFactoryContractFactory, smartWalletFactoryContract
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          smartWalletContractFactory = new ethers_1.ContractFactory(SmartWalletABI_json_1.default, SmartWalletBytecode_json_1.default, utils_1.rpcAccount)
          return [4 /* yield */, smartWalletContractFactory.deploy()]
        case 1:
          smartWalletContract = _a.sent()
          return [4 /* yield */, smartWalletContract.deployTransaction.wait()]
        case 2:
          _a.sent()
          smartWalletFactoryContractFactory = new ethers_1.ContractFactory(SmartWalletFactoryABI_json_1.default, SmartWalletFactoryBytecode_json_1.default, utils_1.rpcAccount)
          return [4 /* yield */, smartWalletFactoryContractFactory.deploy(smartWalletContract.address)]
        case 3:
          smartWalletFactoryContract = _a.sent()
          return [4 /* yield */, smartWalletFactoryContract.deployTransaction.wait()]
        case 4:
          _a.sent()
          return [2 /* return */, smartWalletFactoryContract]
      }
    })
  })
}
exports.deploySmartWalletFactory = deploySmartWalletFactory
exports.returnSenderContractFactory = new ethers_1.ContractFactory([
  {
    constant: true,
    inputs: [],
    name: 'getSender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
], '0x608060405234801561001057600080fd5b5060b28061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635e01eb5a14602d575b600080fd5b60336075565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60003390509056fea265627a7a723158206474b02d75ef54f55328b06e0c15c762d1f7515c46b8a2deef03acc675f28c1464736f6c63430005100032', utils_1.rpcAccount)
exports.wasteGasContractFactory = new ethers_1.ContractFactory([
  {
    constant: false,
    inputs: [],
    name: 'wasteGas',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
], '0x608060405260008055348015601357600080fd5b506096806100226000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633b6a02f614602d575b600080fd5b60336035565b005b60008090505b60c8811015605e578060008082825401925050819055508080600101915050603b565b5056fea265627a7a72315820dc4943905a3c2af2a2fdba0c68218f4ff91bf1f1441be84cdf23a88ba1d01b9764736f6c63430005100032', utils_1.rpcAccount)
exports.revertsContractFactory = new ethers_1.ContractFactory([
  {
    constant: true,
    inputs: [],
    name: 'makeRevert',
    outputs: [],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  }
], '0x6080604052348015600f57600080fd5b50606f80601d6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632517ecb114602d575b600080fd5b60336035565b005b600080fdfea265627a7a72315820286f44ff552edf0267399dc5e456c57805042b05cfc57c516263aaef546d4f2e64736f6c63430005100032', utils_1.rpcAccount)
exports.erc677ContractFactory = new ethers_1.ContractFactory(ERC677ABI_json_1.default, ERC677Bytecode_json_1.default, utils_1.rpcAccount)
