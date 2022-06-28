import { IToken } from './BaseToken';
import { ERC20Token } from './ERC20Token';
import { RBTCToken } from './RBTCToken';
import { Signer } from '@ethersproject/abstract-signer';
import { ITokenWithBalance } from '@rsksmart/rif-wallet-types';
export interface ITokenMetadata {
    [address: string]: {
        name: string;
        logo?: string;
        erc20?: boolean;
        symbol: string;
        decimals: number;
    };
}
export interface IConvertToERC20Options {
    chainId: number;
    signer: Signer;
}
export declare const MAINNET_CHAINID = 30;
export declare const imagesUrlMainnet = "https://raw.githubusercontent.com/rsksmart/rsk-testnet-contract-metadata/master/images";
export declare const tokensMetadataMainnet: ITokenMetadata;
export declare const imagesUrlTestnet = "https://raw.githubusercontent.com/rsksmart/rsk-contract-metadata/master/images";
export declare const tokensMetadataTestnet: ITokenMetadata;
export declare const getTokenLogo: (address: string, chainId: number) => any;
export declare const getAllTokens: (signer: Signer) => Promise<IToken[]>;
export declare const convertToERC20Token: (token: ITokenWithBalance, { chainId, signer }: IConvertToERC20Options) => ERC20Token;
export declare const makeRBTCToken: (signer: Signer, chainId: number) => RBTCToken;
