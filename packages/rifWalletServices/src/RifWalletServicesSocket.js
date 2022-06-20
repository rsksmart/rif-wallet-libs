"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RifWalletServicesSocket = void 0;
var events_1 = __importDefault(require("events"));
var socket_io_client_1 = require("socket.io-client");
var ActivityScreen_1 = require("../../screens/activity/ActivityScreen");
var RifWalletServicesSocket = /** @class */ (function (_super) {
    __extends(RifWalletServicesSocket, _super);
    function RifWalletServicesSocket(rifWalletServicesUrl, fetcher, abiEnhancer) {
        var _this = _super.call(this) || this;
        _this.abiEnhancer = abiEnhancer;
        _this.fetcher = fetcher;
        _this.rifWalletServicesUrl = rifWalletServicesUrl;
        return _this;
    }
    RifWalletServicesSocket.prototype.init = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchedTransactions, activityTransactions, fetchedTokens;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetcher.fetchTransactionsByAddress(wallet.smartWalletAddress)];
                    case 1:
                        fetchedTransactions = _a.sent();
                        return [4 /*yield*/, Promise.all(fetchedTransactions.data.map(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var enhancedTransaction;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, ActivityScreen_1.enhanceTransactionInput)(tx, wallet, this.abiEnhancer)];
                                        case 1:
                                            enhancedTransaction = _a.sent();
                                            return [2 /*return*/, {
                                                    originTransaction: tx,
                                                    enhancedTransaction: enhancedTransaction,
                                                }];
                                    }
                                });
                            }); }))];
                    case 2:
                        activityTransactions = _a.sent();
                        return [4 /*yield*/, this.fetcher.fetchTokensByAddress(wallet.smartWalletAddress)];
                    case 3:
                        fetchedTokens = (_a.sent());
                        this.emit('init', {
                            transactions: activityTransactions,
                            balances: fetchedTokens,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RifWalletServicesSocket.prototype.connect = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var socket_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.init(wallet)];
                    case 1:
                        _a.sent();
                        socket_1 = (0, socket_io_client_1.io)(this.rifWalletServicesUrl, {
                            path: '/ws',
                            forceNew: true,
                            reconnectionAttempts: 3,
                            timeout: 2000,
                            autoConnect: true,
                            transports: ['websocket'], // you need to explicitly tell it to use websocket
                        });
                        socket_1.on('connect', function () {
                            socket_1.on('change', function (event) {
                                _this.emit('change', event);
                            });
                            socket_1.emit('subscribe', { address: wallet.smartWalletAddress });
                        });
                        this.socket = socket_1;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('socket error', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RifWalletServicesSocket.prototype.disconnect = function () {
        if (this.socket) {
            this.socket.disconnect();
        }
    };
    RifWalletServicesSocket.prototype.isConnected = function () {
        return !!this.socket;
    };
    return RifWalletServicesSocket;
}(events_1.default));
exports.RifWalletServicesSocket = RifWalletServicesSocket;
