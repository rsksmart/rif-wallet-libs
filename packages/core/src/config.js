"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletSetting = exports.SETTINGS = void 0;
var react_native_config_1 = __importDefault(require("react-native-config"));
var SETTINGS;
(function (SETTINGS) {
    SETTINGS["RIF_WALLET_SERVICE_URL"] = "RIF_WALLET_SERVICE_URL";
    SETTINGS["RPC_URL"] = "RPC_URL";
    SETTINGS["SMART_WALLET_FACTORY_ADDRESS"] = "SMART_WALLET_FACTORY_ADDRESS";
})(SETTINGS = exports.SETTINGS || (exports.SETTINGS = {}));
var getWalletSetting = function (setting, chainId) {
    if (chainId === void 0) { chainId = 31; }
    switch (setting) {
        case SETTINGS.RIF_WALLET_SERVICE_URL:
            return react_native_config_1.default.RIF_WALLET_SERVICE_URL;
        case SETTINGS.RPC_URL:
            return react_native_config_1.default["NETWORK" + chainId.toString() + "_RPC_URL"];
        case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
            return react_native_config_1.default["NETWORK" + chainId.toString() + "_SW_ADDRESS"];
    }
};
exports.getWalletSetting = getWalletSetting;
