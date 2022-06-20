"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var AbiEnhancer_1 = require("./AbiEnhancer");
var utils_1 = require("../../test-lib/src/utils");
var tokenMetadata = __importStar(require("../../token/src/tokenMetadata"));
describe('Abi Enhancer', function () {
    var transactionRequest = {
        from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
        to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
        value: ethers_1.BigNumber.from(1000000000000000),
        data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000',
    };
    var accountSigner = null;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, firstErc20Token, secondErc20Token, rbtcToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    accountSigner = (0, utils_1.getSigner)();
                    return [4 /*yield*/, (0, utils_1.deployTestTokens)(accountSigner)];
                case 1:
                    _a = _b.sent(), firstErc20Token = _a.firstErc20Token, secondErc20Token = _a.secondErc20Token, rbtcToken = _a.rbtcToken;
                    tokenMetadata.getAllTokens = jest.fn(function () {
                        return Promise.resolve([firstErc20Token, secondErc20Token]);
                    });
                    tokenMetadata.makeRBTCToken = jest.fn(function () { return rbtcToken; });
                    transactionRequest = __assign(__assign({}, transactionRequest), { to: firstErc20Token.address });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return erc20 token info enhanced', function () { return __awaiter(void 0, void 0, void 0, function () {
        var enhancer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enhancer = new AbiEnhancer_1.AbiEnhancer();
                    return [4 /*yield*/, enhancer.enhance(accountSigner, transactionRequest)];
                case 1:
                    result = _a.sent();
                    expect(result).not.toBeNull();
                    expect(result.from).toBe(transactionRequest.from);
                    expect(result.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934');
                    expect(result.balance).toBe(ethers_1.BigNumber.from(200).toString());
                    expect(result.value).toBe('0.001');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return RBTC info enhanced if data is undefined', function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, enhancer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.getSigner)(7)];
                case 1:
                    account = _a.sent();
                    enhancer = new AbiEnhancer_1.AbiEnhancer();
                    return [4 /*yield*/, enhancer.enhance(account, __assign(__assign({}, transactionRequest), { data: undefined }))];
                case 2:
                    result = _a.sent();
                    expect(result).not.toBeNull();
                    expect(result.from).toBe(transactionRequest.from);
                    expect(result.to).toBe(transactionRequest.to);
                    expect(result.balance).toBe('100');
                    expect(result.value).toBe('0.001');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return RBTC info enhanced if the token is not in the tokens metadata', function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, enhancer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = (0, utils_1.getSigner)(7);
                    enhancer = new AbiEnhancer_1.AbiEnhancer();
                    return [4 /*yield*/, enhancer.enhance(account, __assign(__assign({}, transactionRequest), { data: undefined, to: '0xNotExist' }))];
                case 1:
                    result = _a.sent();
                    expect(result).not.toBeNull();
                    expect(result.from).toBe(transactionRequest.from);
                    expect(result.to).toBe('0xNotExist');
                    expect(result.balance).toBe('100');
                    expect(result.value).toBe('0.001');
                    return [2 /*return*/];
            }
        });
    }); });
});
