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
var WalletConnectAdapter_1 = require("./WalletConnectAdapter");
describe('Wallet Connect Adapter', function () {
    var _this = this;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            this.signer = (0, utils_1.getSigner)(9);
            this.adapter = new WalletConnectAdapter_1.WalletConnectAdapter(this.signer);
            return [2 /*return*/];
        });
    }); });
    test('send tx', function () { return __awaiter(_this, void 0, void 0, function () {
        var from, to, chainId, method, params, mockIt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.signer.getAddress()];
                case 1:
                    from = _a.sent();
                    return [4 /*yield*/, (0, utils_1.getSigner)(0).getAddress()];
                case 2:
                    to = _a.sent();
                    return [4 /*yield*/, this.signer.getChainId()];
                case 3:
                    chainId = _a.sent();
                    method = 'eth_sendTransaction';
                    params = [
                        {
                            data: '0x123456789a',
                            from: from,
                            to: to,
                            value: '0x3e8',
                            gas: '25000',
                            gasPrice: '60000000',
                            chainId: chainId,
                        },
                    ];
                    mockIt = jest.fn();
                    jest.spyOn(this.signer, 'sendTransaction').mockImplementation(function (tx) {
                        mockIt(tx);
                        return Promise.resolve(tx);
                    });
                    return [4 /*yield*/, this.adapter.handleCall(method, params)];
                case 4:
                    _a.sent();
                    expect(mockIt).toBeCalledWith({
                        data: params[0].data,
                        from: from,
                        to: to,
                        chainId: chainId,
                        nonce: undefined,
                        gasPrice: ethers_1.BigNumber.from(params[0].gasPrice),
                        gasLimit: ethers_1.BigNumber.from(params[0].gas),
                        value: ethers_1.BigNumber.from('0x3e8'),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('default parameters are set', function () { return __awaiter(_this, void 0, void 0, function () {
        var method, from, to, params, mockIt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = 'eth_sendTransaction';
                    return [4 /*yield*/, this.signer.getAddress()];
                case 1:
                    from = _a.sent();
                    return [4 /*yield*/, (0, utils_1.getSigner)(0).getAddress()];
                case 2:
                    to = _a.sent();
                    params = [
                        {
                            to: to,
                            from: from,
                        },
                    ];
                    mockIt = jest.fn();
                    jest.spyOn(this.signer, 'sendTransaction').mockImplementation(function (tx) {
                        mockIt(tx);
                        return Promise.resolve(tx);
                    });
                    return [4 /*yield*/, this.adapter.handleCall(method, params)];
                case 3:
                    _a.sent();
                    expect(mockIt).toBeCalledWith({
                        to: to,
                        from: from,
                        data: '0x',
                        chainId: undefined,
                        gasLimit: undefined,
                        gasPrice: undefined,
                        nonce: undefined,
                        value: ethers_1.BigNumber.from(0),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // method not supported by ganache-cli
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip('personal sign', function () { return __awaiter(_this, void 0, void 0, function () {
        var from, message, method, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.signer.getAddress()];
                case 1:
                    from = _a.sent();
                    message = '0x68656c6c6f20776f726c6421';
                    method = 'personal_sign';
                    params = [message, from];
                    return [4 /*yield*/, this.adapter.handleCall(method, params)];
                case 2:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toContain('0x');
                    return [2 /*return*/];
            }
        });
    }); });
    // method not supported by ganache-cli
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip('sign typed data', function () { return __awaiter(_this, void 0, void 0, function () {
        var method, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = 'eth_signTypedData';
                    params = [
                        '0x5cD710d005a37785736eBA7d0395E73869edb8E2',
                        '{"domain":{"chainId":31,"name":"Ether Mail","version":"1"},"message":{"contents":"{     from: {         name: \'Cow\',         wallet: \'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826\'     },     to: {         name: \'Bob\',         wallet: \'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB\'     },     contents: \'Hello, Bob!\' }","from":"Diego","to":"Cesar"},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Mail":[{"name":"from","type":"string"},{"name":"to","type":"string"},{"name":"contents","type":"string"}]}}',
                    ];
                    return [4 /*yield*/, this.adapter.handleCall(method, params)];
                case 1:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result).toContain('0x');
                    return [2 /*return*/];
            }
        });
    }); });
});
