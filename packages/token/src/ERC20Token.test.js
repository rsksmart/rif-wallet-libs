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
var utils_1 = require("../../test-lib/src/utils");
var BaseToken_1 = require("./BaseToken");
var ERC20Token_1 = require("./ERC20Token");
var types_1 = require("./types");
var ERC677__factory_1 = require("./types/factories/ERC677__factory");
describe('ERC20 token', function () {
    var erc20Token = null;
    var tokenAddress = '';
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, accountAddress, initialSupply, erc677Factory, erc20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = (0, utils_1.getSigner)();
                    return [4 /*yield*/, account.getAddress()
                        // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
                    ];
                case 1:
                    accountAddress = _a.sent();
                    initialSupply = ethers_1.BigNumber.from(10).mul((0, BaseToken_1.tenPow)(utils_1.TEST_TOKEN_DECIMALS));
                    erc677Factory = new ERC677__factory_1.ERC677__factory(account);
                    return [4 /*yield*/, erc677Factory.deploy(accountAddress, initialSupply, 'TEST_ERC20', 'TEST_ERC20')];
                case 2:
                    erc20 = (_a.sent());
                    tokenAddress = erc20.address;
                    erc20Token = new ERC20Token_1.ERC20Token(tokenAddress, account, 'TEST_ERC20', 'logo.jpg');
                    return [2 /*return*/];
            }
        });
    }); });
    test('get symbol', function () { return __awaiter(void 0, void 0, void 0, function () {
        var symbol;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, erc20Token.symbol];
                case 1:
                    symbol = _a.sent();
                    expect(symbol).toBe('TEST_ERC20');
                    return [2 /*return*/];
            }
        });
    }); });
    test('get logo', function () { return __awaiter(void 0, void 0, void 0, function () {
        var logo;
        return __generator(this, function (_a) {
            logo = erc20Token.logo;
            expect(logo).toBe('logo.jpg');
            return [2 /*return*/];
        });
    }); });
    test('get decimals', function () { return __awaiter(void 0, void 0, void 0, function () {
        var decimals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, erc20Token.decimals()];
                case 1:
                    decimals = _a.sent();
                    expect(decimals).toBe(utils_1.TEST_TOKEN_DECIMALS);
                    return [2 /*return*/];
            }
        });
    }); });
    test('get type', function () { return __awaiter(void 0, void 0, void 0, function () {
        var type;
        return __generator(this, function (_a) {
            type = erc20Token.getType();
            expect(type).toBe('erc20');
            return [2 /*return*/];
        });
    }); });
    test('get balance', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, erc20Token.balance()];
                case 1:
                    result = _a.sent();
                    expect(result.toString()).toBe('10000000000000000000');
                    return [2 /*return*/];
            }
        });
    }); });
    test('transfer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var from, fromAddress, to, toAddress, amountToTransfer, sender, balanceSender, transferTx, recipient, balanceRecipient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = (0, utils_1.getSigner)();
                    return [4 /*yield*/, from.getAddress()];
                case 1:
                    fromAddress = _a.sent();
                    to = (0, utils_1.getSigner)(1);
                    return [4 /*yield*/, to.getAddress()];
                case 2:
                    toAddress = _a.sent();
                    amountToTransfer = ethers_1.BigNumber.from(100);
                    sender = types_1.ERC20__factory.connect(tokenAddress, from);
                    return [4 /*yield*/, sender.balanceOf(fromAddress)];
                case 3:
                    balanceSender = _a.sent();
                    expect(balanceSender.gte(amountToTransfer)).toBe(true);
                    return [4 /*yield*/, erc20Token.transfer(toAddress, amountToTransfer)];
                case 4:
                    transferTx = _a.sent();
                    return [4 /*yield*/, transferTx.wait()];
                case 5:
                    _a.sent();
                    recipient = types_1.ERC20__factory.connect(tokenAddress, to);
                    return [4 /*yield*/, recipient.balanceOf(toAddress)];
                case 6:
                    balanceRecipient = _a.sent();
                    expect(balanceRecipient.eq(amountToTransfer)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
