export declare enum SETTINGS {
    RIF_WALLET_SERVICE_URL = "RIF_WALLET_SERVICE_URL",
    RPC_URL = "RPC_URL",
    SMART_WALLET_FACTORY_ADDRESS = "SMART_WALLET_FACTORY_ADDRESS"
}
export declare const getWalletSetting: (setting: SETTINGS, chainId?: 31) => string;
