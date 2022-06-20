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
var ethers_1 = require("ethers");
var rif_wallet_test_lib_1 = require("@rsksmart/rif-wallet-test-lib");
var rif_wallet_kms_1 = require("@rsksmart/rif-wallet-kms");
var rif_wallet_core_1 = require("@rsksmart/rif-wallet-core");
describe('e2e', function () {
    var _this = this;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, kms, walletRequest;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = this;
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.deploySmartWalletFactory)()
                        // account creation
                    ];
                case 1:
                    _a.smartWalletFactoryContract = _b.sent();
                    kms = rif_wallet_kms_1.KeyManagementSystem.create();
                    walletRequest = kms.nextWallet(31);
                    // user confirmation
                    walletRequest.save();
                    // funding account
                    this.wallet = walletRequest.wallet.connect(rif_wallet_test_lib_1.testJsonRpcProvider);
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)((0, rif_wallet_test_lib_1.fundAccount)(this.wallet.address))];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('send transaction', function () { return __awaiter(_this, void 0, void 0, function () {
        var gasPrice, onRequest, rifWallet, txRequest, tx, receipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gasPrice = ethers_1.BigNumber.from('100000');
                    onRequest = (function (nextRequest) {
                        nextRequest.confirm({ gasPrice: gasPrice });
                    });
                    return [4 /*yield*/, rif_wallet_core_1.RIFWallet.create(this.wallet, this.smartWalletFactoryContract.address, onRequest)];
                case 1:
                    rifWallet = _a.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)(rifWallet.smartWalletFactory.deploy())
                        // send transaction
                    ];
                case 2:
                    _a.sent();
                    txRequest = {
                        to: '0x0000000000111111111122222222223333333333',
                        data: '0x'
                    };
                    return [4 /*yield*/, rifWallet.sendTransaction(txRequest)
                        // transaction is confirmed (mined)
                    ];
                case 3:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 4:
                    receipt = _a.sent();
                    expect(tx.gasPrice).toEqual(gasPrice);
                    expect(receipt.status).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('contract interaction', function () { return __awaiter(_this, void 0, void 0, function () {
        var onRequest, rifWallet, initialBalance, erc677Contract, connectedContract, balance, receiver, amount, tx, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onRequest = function (nextRequest) { return nextRequest.confirm(); };
                    return [4 /*yield*/, rif_wallet_core_1.RIFWallet.create(this.wallet, this.smartWalletFactoryContract.address, onRequest)];
                case 1:
                    rifWallet = _b.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.sendAndWait)(rifWallet.smartWalletFactory.deploy())];
                case 2:
                    _b.sent();
                    initialBalance = ethers_1.BigNumber.from('10000000000000000000') // 10 RIF
                    ;
                    return [4 /*yield*/, rif_wallet_test_lib_1.erc677ContractFactory.deploy(rifWallet.smartWalletAddress, initialBalance, 'RIF Token', 'RIF')];
                case 3:
                    erc677Contract = _b.sent();
                    return [4 /*yield*/, erc677Contract.deployTransaction.wait()];
                case 4:
                    _b.sent();
                    connectedContract = erc677Contract.connect(rifWallet);
                    return [4 /*yield*/, connectedContract.balanceOf(rifWallet.smartWalletAddress)];
                case 5:
                    balance = _b.sent();
                    expect(balance).toEqual(initialBalance);
                    receiver = '0x1111111111222222222233333333334444444444';
                    amount = ethers_1.BigNumber.from('1000000000000000000');
                    return [4 /*yield*/, connectedContract.transfer(receiver, amount)]; // RIF
                case 6:
                    tx = _b.sent() // RIF
                    ;
                    return [4 /*yield*/, tx.wait()];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, connectedContract.balanceOf(receiver)];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual(amount);
                    return [2 /*return*/];
            }
        });
    }); });
});
