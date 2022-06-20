"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rif_wallet_test_lib_1 = require("@rsksmart/rif-wallet-test-lib");
var SmartWallet_1 = require("../src/SmartWallet");
var SmartWalletFactory_1 = require("../src/SmartWalletFactory");
describe('SmartWallet', function () {
    var _this = this;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, smartWalletFactoryContract, smartWalletFactory, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = this;
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.createNewTestWallet)()];
                case 1:
                    _a.wallet = _d.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.deploySmartWalletFactory)()];
                case 2:
                    smartWalletFactoryContract = _d.sent();
                    return [4 /*yield*/, SmartWalletFactory_1.SmartWalletFactory.create(this.wallet, smartWalletFactoryContract.address)];
                case 3:
                    smartWalletFactory = _d.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)(smartWalletFactory.deploy())];
                case 4:
                    _d.sent();
                    _b = this;
                    return [4 /*yield*/, smartWalletFactory.getSmartWalletAddress()];
                case 5:
                    _b.smartWalletAddress = _d.sent();
                    _c = this;
                    return [4 /*yield*/, SmartWallet_1.SmartWallet.create(this.wallet, this.smartWalletAddress)];
                case 6:
                    _c.smartWallet = _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('addresses', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, this.smartWallet.address];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual(this.wallet.address);
                    _b = expect;
                    return [4 /*yield*/, this.smartWallet.smartWalletAddress];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual(this.smartWalletAddress);
                    return [2 /*return*/];
            }
        });
    }); });
    test('direct send', function () { return __awaiter(_this, void 0, void 0, function () {
        var to, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    to = '0x0000000000111111111122222222223333333333';
                    data = '0xabcd';
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)(this.smartWallet.directExecute(to, data))];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, this.smartWallet.signer.getTransactionCount()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
    test('estimate direct send', function () { return __awaiter(_this, void 0, void 0, function () {
        var to, data, gasLimit, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    to = '0x0000000000111111111122222222223333333333';
                    data = '0xabcd';
                    return [4 /*yield*/, this.smartWallet.estimateDirectExecute(to, data)];
                case 1:
                    gasLimit = _b.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)(this.smartWallet.directExecute(to, data, { gasLimit: gasLimit }))];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, this.smartWallet.signer.getTransactionCount()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('call', function () {
        test('successful', function () { return __awaiter(_this, void 0, void 0, function () {
            var returnSenderContract, to, data, calldata, sender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rif_wallet_test_lib_1.returnSenderContractFactory.deploy()];
                    case 1:
                        returnSenderContract = _a.sent();
                        return [4 /*yield*/, returnSenderContract.deployTransaction.wait()];
                    case 2:
                        _a.sent();
                        to = returnSenderContract.address;
                        data = returnSenderContract.interface.encodeFunctionData('getSender');
                        return [4 /*yield*/, this.smartWallet.callStaticDirectExecute(to, data)];
                    case 3:
                        calldata = _a.sent();
                        sender = returnSenderContract.interface.decodeFunctionResult('getSender', calldata)[0];
                        expect(sender).toEqual(this.smartWallet.smartWalletAddress);
                        return [2 /*return*/];
                }
            });
        }); });
        test('reverting', function () { return __awaiter(_this, void 0, void 0, function () {
            var revertsContract, to, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rif_wallet_test_lib_1.revertsContractFactory.deploy()];
                    case 1:
                        revertsContract = _a.sent();
                        return [4 /*yield*/, revertsContract.deployTransaction.wait()];
                    case 2:
                        _a.sent();
                        to = revertsContract.address;
                        data = revertsContract.interface.encodeFunctionData('makeRevert');
                        return [4 /*yield*/, expect(this.smartWallet.callStaticDirectExecute(to, data)).rejects.toThrow()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
