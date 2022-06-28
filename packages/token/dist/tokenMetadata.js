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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRBTCToken = exports.convertToERC20Token = exports.getAllTokens = exports.getTokenLogo = exports.tokensMetadataTestnet = exports.imagesUrlTestnet = exports.tokensMetadataMainnet = exports.imagesUrlMainnet = exports.MAINNET_CHAINID = void 0;
// @ts-ignore
var rsk_contract_metadata_1 = __importDefault(require("@rsksmart/rsk-contract-metadata"));
// @ts-ignore
var rsk_testnet_contract_metadata_1 = __importDefault(require("@rsksmart/rsk-testnet-contract-metadata"));
// @ts-ignore
var RBTC_mainnet_svg_1 = __importDefault(require("./assets/RBTC-mainnet.svg"));
// @ts-ignore
var RBTC_testnet_svg_1 = __importDefault(require("./assets/RBTC-testnet.svg"));
// @ts-ignore
var token_mainnet_svg_1 = __importDefault(require("./assets/token-mainnet.svg"));
// @ts-ignore
var token_testnet_svg_1 = __importDefault(require("./assets/token-testnet.svg"));
var ERC20Token_1 = require("./ERC20Token");
var RBTCToken_1 = require("./RBTCToken");
exports.MAINNET_CHAINID = 30;
exports.imagesUrlMainnet = 'https://raw.githubusercontent.com/rsksmart/rsk-testnet-contract-metadata/master/images';
exports.tokensMetadataMainnet = rsk_contract_metadata_1.default;
exports.imagesUrlTestnet = 'https://raw.githubusercontent.com/rsksmart/rsk-contract-metadata/master/images';
exports.tokensMetadataTestnet = rsk_testnet_contract_metadata_1.default;
var getTokenLogo = function (address, chainId) {
    var tokensMetadata = chainId === exports.MAINNET_CHAINID ? exports.tokensMetadataMainnet : exports.tokensMetadataTestnet;
    var imageBaseUrl = chainId === exports.MAINNET_CHAINID ? exports.imagesUrlMainnet : exports.imagesUrlTestnet;
    if (tokensMetadata[address] && tokensMetadata[address].logo) {
        return imageBaseUrl + "/" + tokensMetadata[address].logo;
    }
    return chainId === exports.MAINNET_CHAINID ? token_mainnet_svg_1.default : token_testnet_svg_1.default;
};
exports.getTokenLogo = getTokenLogo;
var getAllTokens = function (signer) { return __awaiter(void 0, void 0, void 0, function () {
    var chainId, metadataTokens, metadataKeys, tokens, rbtc, _i, metadataKeys_1, address, addressWithoutChecksum, symbol, logo, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, signer.getChainId()];
            case 1:
                chainId = _a.sent();
                metadataTokens = chainId === exports.MAINNET_CHAINID ? exports.tokensMetadataMainnet : exports.tokensMetadataTestnet;
                metadataKeys = Object.keys(metadataTokens);
                tokens = [];
                rbtc = (0, exports.makeRBTCToken)(signer, chainId);
                tokens.push(rbtc);
                for (_i = 0, metadataKeys_1 = metadataKeys; _i < metadataKeys_1.length; _i++) {
                    address = metadataKeys_1[_i];
                    addressWithoutChecksum = address.toLowerCase();
                    symbol = metadataTokens[address].symbol;
                    logo = (0, exports.getTokenLogo)(addressWithoutChecksum, chainId);
                    token = new ERC20Token_1.ERC20Token(addressWithoutChecksum, signer, symbol, logo);
                    tokens.push(token);
                }
                return [2 /*return*/, tokens];
        }
    });
}); };
exports.getAllTokens = getAllTokens;
var convertToERC20Token = function (token, _a) {
    var chainId = _a.chainId, signer = _a.signer;
    var addressWithoutChecksum = token.contractAddress.toLowerCase();
    var logo = (0, exports.getTokenLogo)(addressWithoutChecksum, chainId);
    return new ERC20Token_1.ERC20Token(addressWithoutChecksum, signer, token.symbol, logo);
};
exports.convertToERC20Token = convertToERC20Token;
var makeRBTCToken = function (signer, chainId) {
    var rbtcLogo = chainId === exports.MAINNET_CHAINID ? RBTC_mainnet_svg_1.default : RBTC_testnet_svg_1.default;
    var rbtcSymbol = chainId === exports.MAINNET_CHAINID ? 'RBTC' : 'TRBTC';
    var rbtc = new RBTCToken_1.RBTCToken(signer, rbtcSymbol, rbtcLogo, chainId);
    return rbtc;
};
exports.makeRBTCToken = makeRBTCToken;
