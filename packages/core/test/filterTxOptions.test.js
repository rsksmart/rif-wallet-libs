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
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var filterTxOptions_1 = require("../src/filterTxOptions");
test('filterTxOptions', function () {
    var txOptions = {
        gasPrice: ethers_1.BigNumber.from('10'),
        gasLimit: ethers_1.BigNumber.from('10'),
        value: ethers_1.BigNumber.from('10')
    };
    var txRequest = __assign({ from: '0xabcd', to: '0xabcd', data: '0xabcd' }, txOptions);
    var filteredTxRequest = (0, filterTxOptions_1.filterTxOptions)(txRequest);
    expect(filteredTxRequest).toEqual(txOptions);
});
