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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectedBrowserAdapter = void 0;
var AccountsResolver_1 = require("./resolvers/AccountsResolver");
var CallsResolver_1 = require("./resolvers/CallsResolver");
var ChainIdResolver_1 = require("./resolvers/ChainIdResolver");
var EstimateGasResolver_1 = require("./resolvers/EstimateGasResolver");
var GetBalanceResolver_1 = require("./resolvers/GetBalanceResolver");
var GetBlockByNumberResolver_1 = require("./resolvers/GetBlockByNumberResolver");
var BlockNumberResolver_1 = require("./resolvers/BlockNumberResolver");
var NetVersionResolver_1 = require("./resolvers/NetVersionResolver");
var PersonalSignResolver_1 = require("./resolvers/PersonalSignResolver");
var RequestAccountsResolver_1 = require("./resolvers/RequestAccountsResolver");
var SendTransactionResolver_1 = require("./resolvers/SendTransactionResolver");
var SignTypedDataResolver_1 = require("./resolvers/SignTypedDataResolver");
var SignTypedDataV4Resolver_1 = require("./resolvers/SignTypedDataV4Resolver");
var GasPriceResolver_1 = require("./resolvers/GasPriceResolver");
var RPCAdapter_1 = require("./RPCAdapter");
var GetTransactionByHashResolver_1 = require("./resolvers/GetTransactionByHashResolver");
var GetTransactionReceiptResolver_1 = require("./resolvers/GetTransactionReceiptResolver");
var InjectedBrowserAdapter = /** @class */ (function (_super) {
    __extends(InjectedBrowserAdapter, _super);
    function InjectedBrowserAdapter(signer) {
        return _super.call(this, [
            new SendTransactionResolver_1.SendTransactionResolver(signer),
            new PersonalSignResolver_1.PersonalSignResolver(signer),
            new SignTypedDataResolver_1.SignTypedDataResolver(signer),
            new SignTypedDataV4Resolver_1.SignTypedDataV4Resolver(signer),
            new AccountsResolver_1.AccountsResolver(signer),
            new RequestAccountsResolver_1.RequestAccountsResolver(signer),
            new ChainIdResolver_1.ChainIdResolver(signer),
            new NetVersionResolver_1.NetVersionResolver(signer),
            new CallsResolver_1.CallsResolver(signer),
            new EstimateGasResolver_1.EstimateGasResolver(signer),
            new GetBalanceResolver_1.GetBalanceResolver(signer),
            new BlockNumberResolver_1.BlockNumberResolver(signer),
            new GetBlockByNumberResolver_1.GetBlockByNumberResolver(signer),
            new GasPriceResolver_1.GasPriceResolver(signer),
            new GetTransactionByHashResolver_1.GetTransactionByHashResolver(signer),
            new GetTransactionReceiptResolver_1.GetTransactionReceiptResolver(signer)
        ]) || this;
    }
    return InjectedBrowserAdapter;
}(RPCAdapter_1.RPCAdapter));
exports.InjectedBrowserAdapter = InjectedBrowserAdapter;
