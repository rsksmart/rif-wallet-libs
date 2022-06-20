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
exports.deployTestTokens = exports.getSigner = exports.TEST_CHAIN_ID = exports.TEST_TOKEN_DECIMALS = exports.getTextFromTextNode = exports.createNewTestWallet = exports.fundAccount = exports.sendAndWait = exports.rpcAccount = exports.testJsonRpcProvider = void 0;
var ethers_1 = require("ethers");
var config_1 = require("../../core/src/config");
var BaseToken_1 = require("../../token/src/BaseToken");
var ERC20Token_1 = require("../../token/src/ERC20Token");
var RBTCToken_1 = require("../../token/src/RBTCToken");
var types_1 = require("../../token/src/types");
var nodeUrl = (0, config_1.getWalletSetting)(config_1.SETTINGS.RPC_URL, 31);
exports.testJsonRpcProvider = new ethers_1.providers.JsonRpcProvider(nodeUrl);
exports.rpcAccount = exports.testJsonRpcProvider.getSigner(0);
var sendAndWait = function (txPromise) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, txPromise];
            case 1: return [4 /*yield*/, (_a.sent()).wait()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.sendAndWait = sendAndWait;
var fundAccount = function (to) {
    return exports.rpcAccount.sendTransaction({
        to: to,
        value: ethers_1.BigNumber.from('1000000000000000000'),
    });
};
exports.fundAccount = fundAccount;
var createNewTestWallet = function (privateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wallet = (!privateKey ? ethers_1.Wallet.createRandom() : new ethers_1.Wallet(privateKey)).connect(exports.testJsonRpcProvider);
                return [4 /*yield*/, (0, exports.sendAndWait)((0, exports.fundAccount)(wallet.address))];
            case 1:
                _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
exports.createNewTestWallet = createNewTestWallet;
var getTextFromTextNode = function (textNode) {
    return textNode.children[0];
};
exports.getTextFromTextNode = getTextFromTextNode;
exports.TEST_TOKEN_DECIMALS = 18;
exports.TEST_CHAIN_ID = 31;
var getSigner = function (index) {
    if (index === void 0) { index = 0; }
    return exports.testJsonRpcProvider.getSigner(index);
};
exports.getSigner = getSigner;
var deployTestTokens = function (accountSigner, initialBalance) {
    if (initialBalance === void 0) { initialBalance = ethers_1.BigNumber.from(200); }
    return __awaiter(void 0, void 0, void 0, function () {
        var rbtcSigner, deploySignerAddress, initialSupply, erc677Factory, firstErc20, secondErc20, firstErc20Token, secondErc20Token, rbtcToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rbtcSigner = (0, exports.getSigner)(7);
                    return [4 /*yield*/, accountSigner.getAddress()
                        // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
                    ];
                case 1:
                    deploySignerAddress = _a.sent();
                    initialSupply = initialBalance.mul((0, BaseToken_1.tenPow)(exports.TEST_TOKEN_DECIMALS));
                    erc677Factory = new types_1.ERC677__factory(accountSigner);
                    return [4 /*yield*/, erc677Factory.deploy(deploySignerAddress, initialSupply, 'FIRST_TEST_ERC20', 'FIRST_TEST_ERC20')];
                case 2:
                    firstErc20 = (_a.sent());
                    return [4 /*yield*/, erc677Factory.deploy(deploySignerAddress, initialSupply, 'SECOND_TEST_ERC20', 'SECOND_TEST_ERC20')];
                case 3:
                    secondErc20 = (_a.sent());
                    firstErc20Token = new ERC20Token_1.ERC20Token(firstErc20.address, accountSigner, 'FIRST_TEST_ERC20', 'logo.jpg');
                    secondErc20Token = new ERC20Token_1.ERC20Token(secondErc20.address, accountSigner, 'SECOND_TEST_ERC20', 'logo.jpg');
                    rbtcToken = new RBTCToken_1.RBTCToken(rbtcSigner, 'TRBTC', 'logo.jpg', 31);
                    return [2 /*return*/, {
                            firstErc20Token: firstErc20Token,
                            secondErc20Token: secondErc20Token,
                            rbtcToken: rbtcToken,
                        }];
            }
        });
    });
};
exports.deployTestTokens = deployTestTokens;
