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
var RIFWallet_1 = require("../src/RIFWallet");
var txRequest = {
    to: '0x0000000000111111111122222222223333333333',
    data: '0xabcd'
};
var voidOnRequest = function () { };
var confirmOnRequest = function (nextRequest) {
    nextRequest.confirm();
};
var rejectOnRequestError = 'Rejected';
var rejectOnRequest = function (nextRequest) {
    throw new Error(rejectOnRequestError);
};
describe('RIFWallet', function () {
    var _this = this;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var wallet, smartWalletFactoryContract;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, rif_wallet_test_lib_1.createNewTestWallet)()];
                case 1:
                    wallet = _a.sent();
                    return [4 /*yield*/, (0, rif_wallet_test_lib_1.deploySmartWalletFactory)()];
                case 2:
                    smartWalletFactoryContract = _a.sent();
                    this.createRIFWallet = function (onRequest) { return __awaiter(_this, void 0, void 0, function () {
                        var rifWallet, tx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, RIFWallet_1.RIFWallet.create(wallet, smartWalletFactoryContract.address, onRequest)];
                                case 1:
                                    rifWallet = _a.sent();
                                    return [4 /*yield*/, rifWallet.smartWalletFactory.deploy()];
                                case 2:
                                    tx = _a.sent();
                                    return [4 /*yield*/, tx.wait()];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, rifWallet];
                            }
                        });
                    }); };
                    return [2 /*return*/];
            }
        });
    }); });
    describe('setup', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.createRIFWallet(voidOnRequest)];
                    case 1:
                        _a.rifWallet = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('uses smart address', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expect(this.rifWallet.address).toEqual(this.rifWallet.smartWallet.address);
                        _a = expect;
                        return [4 /*yield*/, this.rifWallet.getAddress()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(this.rifWallet.smartWallet.smartWalletAddress);
                        return [2 /*return*/];
                }
            });
        }); });
        test('signs with the smart wallet owner', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = expect;
                        return [4 /*yield*/, this.rifWallet.signTransaction(txRequest)];
                    case 1:
                        _c = (_a = _b.apply(void 0, [_d.sent()])).toEqual;
                        return [4 /*yield*/, this.rifWallet.smartWallet.signer.signTransaction(txRequest)];
                    case 2:
                        _c.apply(_a, [_d.sent()]);
                        return [2 /*return*/];
                }
            });
        }); });
        test('sets provider prop', function () { return __awaiter(_this, void 0, void 0, function () {
            var chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rifWallet.getChainId()];
                    case 1:
                        chainId = _a.sent();
                        expect(chainId).toEqual(1337);
                        return [2 /*return*/];
                }
            });
        }); });
        test('cannot connect a new provider', function () {
            expect(function () { return _this.rifWallet.connect({}); }).toThrow();
        });
    });
    describe('onRequest', function () {
        test('gets tx params', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var onRequest, rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRequest = function (nextRequest) {
                            var request = nextRequest;
                            expect(request.payload[0].to).toEqual(txRequest.to);
                            expect(request.payload[0].data).toEqual(txRequest.data);
                            done();
                        };
                        return [4 /*yield*/, this.createRIFWallet(onRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('has type \'sendTransaction\'', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var onRequest, rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRequest = function (nextRequest) {
                            expect(nextRequest.type).toEqual('sendTransaction');
                            done();
                        };
                        return [4 /*yield*/, this.createRIFWallet(onRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('can confirm', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _a.sent();
                        expect(receipt.status).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        test('can reject with given reason', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(rejectOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, expect(rifWallet.sendTransaction(txRequest)).rejects.toThrowError(rejectOnRequestError)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('cannot edit the request', function (done) { return __awaiter(_this, void 0, void 0, function () {
            var onRequest, rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRequest = function (nextRequest) {
                            expect(function () { nextRequest.confirm = (function (v) { }); }).toThrow();
                            expect(function () { nextRequest.reject = function (v) { }; }).toThrow();
                            expect(function () { nextRequest.type = 'sendTransaction'; }).toThrow();
                            expect(function () { nextRequest.payload = {}; }).toThrow();
                            done();
                        };
                        return [4 /*yield*/, this.createRIFWallet(onRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('send transaction', function () {
        test('uses direct send', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, tx, smartTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        _a.sent();
                        expect(tx.to).toEqual(rifWallet.smartWalletAddress);
                        smartTx = rifWallet.smartWallet.smartWalletContract.interface.decodeFunctionData('directExecute', tx.data);
                        expect(smartTx.to).toEqual(txRequest.to);
                        expect(smartTx.data).toEqual(txRequest.data);
                        return [2 /*return*/];
                }
            });
        }); });
        test('uses direct send without data', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, tx, smartTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(__assign(__assign({}, txRequest), { data: undefined }))];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        _a.sent();
                        expect(tx.to).toEqual(rifWallet.smartWalletAddress);
                        smartTx = rifWallet.smartWallet.smartWalletContract.interface.decodeFunctionData('directExecute', tx.data);
                        expect(smartTx.to).toEqual(txRequest.to);
                        expect(smartTx.data).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000');
                        return [2 /*return*/];
                }
            });
        }); });
        test('can edit tx params', function () { return __awaiter(_this, void 0, void 0, function () {
            var gasPrice, gasLimit, onRequest, rifWallet, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gasPrice = ethers_1.BigNumber.from('100');
                        gasLimit = ethers_1.BigNumber.from('600000');
                        onRequest = (function (nextRequest) {
                            nextRequest.confirm({ gasPrice: gasPrice, gasLimit: gasLimit });
                        });
                        return [4 /*yield*/, this.createRIFWallet(onRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.sendTransaction(txRequest)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        _a.sent();
                        expect(tx.gasPrice).toEqual(gasPrice);
                        expect(tx.gasLimit).toEqual(gasLimit);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sign message', function () {
        test('can sign message', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, signature, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.signMessage('hello world')];
                    case 2:
                        signature = _a.sent();
                        address = ethers_1.utils.verifyMessage('hello world', signature);
                        expect(address).toBe(rifWallet.address);
                        return [2 /*return*/];
                }
            });
        }); });
        test('reject sign message', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(rejectOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, expect(rifWallet.signMessage('hello world')).rejects.toThrowError(rejectOnRequestError)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sign typed data', function () {
        var domain = {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        };
        // The named list of all type definitions
        var types = {
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' }
            ],
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' }
            ]
        };
        // The data to sign
        var value = {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
            },
            contents: 'Hello, Bob!'
        };
        test('can sign message', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, signature, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet._signTypedData(domain, types, value)];
                    case 2:
                        signature = _a.sent();
                        address = ethers_1.utils.verifyTypedData(domain, types, value, signature);
                        expect(address).toBe(rifWallet.address);
                        return [2 /*return*/];
                }
            });
        }); });
        test('reject sign message', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(rejectOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, expect(rifWallet._signTypedData(domain, types, value)).rejects.toThrowError(rejectOnRequestError)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('contracts', function () {
        describe('call', function () {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this.createRIFWallet(voidOnRequest)];
                        case 1:
                            _a.rifWallet = _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            test('calls via smart wallet', function () { return __awaiter(_this, void 0, void 0, function () {
                var returnSenderContract, connected, sender;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, rif_wallet_test_lib_1.returnSenderContractFactory.deploy()];
                        case 1:
                            returnSenderContract = _a.sent();
                            return [4 /*yield*/, returnSenderContract.deployTransaction.wait()];
                        case 2:
                            _a.sent();
                            connected = returnSenderContract.connect(this.rifWallet);
                            return [4 /*yield*/, connected.getSender()];
                        case 3:
                            sender = _a.sent();
                            expect(sender).toEqual(this.rifWallet.smartWalletAddress);
                            return [2 /*return*/];
                    }
                });
            }); });
            test('passes blockTag', function () { return __awaiter(_this, void 0, void 0, function () {
                var returnSenderContract, connected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, rif_wallet_test_lib_1.returnSenderContractFactory.deploy()];
                        case 1:
                            returnSenderContract = _a.sent();
                            return [4 /*yield*/, returnSenderContract.deployTransaction.wait()];
                        case 2:
                            _a.sent();
                            connected = returnSenderContract.connect(this.rifWallet);
                            return [4 /*yield*/, expect(connected.getSender({ blockTag: ethers_1.BigNumber.from('0') }) // contract was not created at this moment
                                ).rejects.toThrow()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        test('sends via smart wallet', function () { return __awaiter(_this, void 0, void 0, function () {
            var wasteGasContract, onRequest, rifWallet, connected, tx, smartTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rif_wallet_test_lib_1.wasteGasContractFactory.deploy()];
                    case 1:
                        wasteGasContract = _a.sent();
                        return [4 /*yield*/, wasteGasContract.deployTransaction.wait()];
                    case 2:
                        _a.sent();
                        onRequest = function (nextRequest) {
                            var request = nextRequest;
                            expect(request.payload[0].to).toEqual(wasteGasContract.address);
                            expect(request.payload[0].data).toEqual(wasteGasContract.interface.encodeFunctionData('wasteGas'));
                            nextRequest.confirm();
                        };
                        return [4 /*yield*/, RIFWallet_1.RIFWallet.create(this.rifWallet.smartWallet.signer, this.rifWallet.smartWalletFactory.smartWalletFactoryContract.address, onRequest)];
                    case 3:
                        rifWallet = _a.sent();
                        connected = wasteGasContract.connect(rifWallet);
                        return [4 /*yield*/, connected.wasteGas()];
                    case 4:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 5:
                        _a.sent();
                        expect(tx.to).toEqual(rifWallet.smartWalletAddress);
                        smartTx = rifWallet.smartWallet.smartWalletContract.interface.decodeFunctionData('directExecute', tx.data);
                        expect(smartTx.to).toEqual(wasteGasContract.address);
                        expect(smartTx.data).toEqual(wasteGasContract.interface.encodeFunctionData('wasteGas'));
                        return [2 /*return*/];
                }
            });
        }); });
        test('it estimates gas', function () { return __awaiter(_this, void 0, void 0, function () {
            var rifWallet, result, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRIFWallet(confirmOnRequest)];
                    case 1:
                        rifWallet = _a.sent();
                        return [4 /*yield*/, rifWallet.estimateGas(txRequest)];
                    case 2:
                        result = _a.sent();
                        expect(result.toString()).toBe('27318'); // 0x6ab6
                        return [4 /*yield*/, rifWallet.estimateGas(txRequest)];
                    case 3:
                        expected = _a.sent();
                        expect(result).toEqual(expected);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
