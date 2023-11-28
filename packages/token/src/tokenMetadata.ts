import { Signer } from '@ethersproject/abstract-signer'
import contractMapTestNet from '@rsksmart/rsk-testnet-contract-metadata'
import { ERC20Token } from './ERC20Token'
import { RBTCToken } from './RBTCToken'
import { IToken } from './types/IToken'

const rbtcMainnet = require('./assets/RBTC-mainnet.svg')
const rbtcTestnet = require('./assets/RBTC-testnet.svg')

export interface ITokenMetadata {
  [address: string]: {
    name: string
    logo?: string
    erc20?: boolean
    symbol: string
    decimals: number
  }
}

export const MAINNET_CHAINID = 30

export const tokensMetadataTestnet = contractMapTestNet as ITokenMetadata

export const convertToERC20Token = (token: IToken, signer: Signer) => {
  const addressWithoutChecksum = token.contractAddress.toLowerCase()
  return new ERC20Token(addressWithoutChecksum, signer, token.symbol, '')
}

export const makeRBTCToken = (signer: Signer, chainId: number): RBTCToken => {
  const rbtcLogo = chainId === MAINNET_CHAINID ? rbtcMainnet : rbtcTestnet
  const rbtcSymbol = chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
  const rbtc = new RBTCToken(signer, rbtcSymbol, rbtcLogo, chainId)

  return rbtc
}
