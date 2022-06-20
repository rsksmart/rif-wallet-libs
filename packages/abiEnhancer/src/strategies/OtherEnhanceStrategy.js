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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherEnhanceStrategy = void 0;
var axios_1 = __importDefault(require("axios"));
var bytes_1 = require("@ethersproject/bytes");
var ethers_1 = require("ethers");
var ethList4BytesServiceUrl = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures';
var ethList4BytesWithNamesServiceUrl = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/with_parameter_names';
var getFunctionSignatures = function (fnHexSig) { return __awaiter(void 0, void 0, void 0, function () {
    var functionSignaturePromise, functionSignatureWithNamesPromise;
    return __generator(this, function (_a) {
        functionSignaturePromise = axios_1.default
            .get(ethList4BytesServiceUrl + "/" + fnHexSig)
            .then(function (x) { return x.data; });
        functionSignatureWithNamesPromise = axios_1.default
            .get(ethList4BytesWithNamesServiceUrl + "/" + fnHexSig)
            .then(function (x) { return x.data; });
        return [2 /*return*/, Promise.all([
                functionSignaturePromise,
                functionSignatureWithNamesPromise,
            ])];
    });
}); };
var getHexSig = function (data) {
    var firstFourBytes = (0, bytes_1.hexDataSlice)(data, 0, 4);
    var functionHexWithout0x = firstFourBytes.substring(2);
    return functionHexWithout0x;
};
var parseSignature = function (signatures) {
    var INSIDE_PARENTHESIS = 1;
    var firstSignature = signatures.split(';')[0];
    var parametersExpression = new RegExp(/\((.*)\)/).exec(firstSignature);
    var nameExpression = new RegExp(/(.*)\(/).exec(firstSignature);
    var parameters = parametersExpression
        ? parametersExpression[INSIDE_PARENTHESIS].split(',')
        : [];
    var name = nameExpression ? nameExpression[INSIDE_PARENTHESIS] : '';
    return [name, parameters];
};
var parseSignatureWithParametersNames = function (signaturesWithNames, parametersTypes) {
    var INSIDE_PARENTHESIS = 1;
    var firstSignature = signaturesWithNames.split(';')[0];
    var parametersExpression = new RegExp(/\((.*)\)/).exec(firstSignature);
    var parametersNames = parametersExpression
        ? parametersExpression[INSIDE_PARENTHESIS].split(',')
        : [];
    for (var index = 0; index < parametersNames.length; index++) {
        parametersNames[index] = parametersNames[index]
            .replace(parametersTypes[index] + " ", '')
            .replace(/[_-\s]/g, '');
    }
    return parametersNames;
};
var OtherEnhanceStrategy = /** @class */ (function () {
    function OtherEnhanceStrategy() {
    }
    OtherEnhanceStrategy.prototype.parse = function (signer, transactionRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var hexSig, signaturesFounded, _a, signatures, signaturesWithParametersNames, _b, functionName, parametersTypes, parametersNames, parametersValues, result, index, name_1, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!transactionRequest.data) {
                            return [2 /*return*/, null];
                        }
                        hexSig = getHexSig(transactionRequest.data);
                        signaturesFounded = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getFunctionSignatures(hexSig)];
                    case 2:
                        signaturesFounded = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        signaturesFounded = null;
                        return [3 /*break*/, 4];
                    case 4:
                        if (!signaturesFounded) {
                            return [2 /*return*/, null];
                        }
                        signatures = signaturesFounded[0], signaturesWithParametersNames = signaturesFounded[1];
                        _b = parseSignature(signatures), functionName = _b[0], parametersTypes = _b[1];
                        parametersNames = [];
                        parametersValues = [];
                        if (parametersTypes.length > 0) {
                            parametersNames = parseSignatureWithParametersNames(signaturesWithParametersNames, parametersTypes);
                            parametersValues = ethers_1.utils.defaultAbiCoder.decode(parametersTypes, (0, bytes_1.hexDataSlice)(transactionRequest.data, 4));
                        }
                        result = __assign(__assign({}, transactionRequest), { functionName: functionName, functionParameters: [], from: transactionRequest.from, to: transactionRequest.to });
                        for (index = 0; index < parametersNames.length; index++) {
                            name_1 = parametersNames[index];
                            value = parametersValues[index];
                            result.functionParameters.push({ name: name_1, value: value });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return OtherEnhanceStrategy;
}());
exports.OtherEnhanceStrategy = OtherEnhanceStrategy;
