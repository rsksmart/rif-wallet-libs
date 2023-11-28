import { Signer } from '@ethersproject/abstract-signer'
import contractMapTestNet from '@rsksmart/rsk-testnet-contract-metadata'
import { IToken } from './BaseToken'
import { ERC20Token } from './ERC20Token'
import { RBTCToken } from './RBTCToken'
import { ITokenWithBalance } from './types/ITokenWithBalance'

const contractMapMainnet = require('@rsksmart/rsk-contract-metadata')
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

export const tokensMetadataMainnet = contractMapMainnet as ITokenMetadata
export const tokensMetadataTestnet = contractMapTestNet as ITokenMetadata

export const getAllTokens = async (signer: Signer): Promise<IToken[]> => {
  const chainId = await signer.getChainId()

  const metadataTokens =
    chainId === MAINNET_CHAINID ? tokensMetadataMainnet : tokensMetadataTestnet

  const metadataKeys = Object.keys(metadataTokens)

  const tokens: IToken[] = []

  const rbtc = makeRBTCToken(signer, chainId)

  tokens.push(rbtc)

  for (const address of metadataKeys) {
    const addressWithoutChecksum = address.toLowerCase()
    const symbol = metadataTokens[address].symbol
    const token = new ERC20Token(addressWithoutChecksum, signer, symbol, '')

    tokens.push(token)
  }

  return tokens
}

export const convertToERC20Token = (
  token: ITokenWithBalance,
  signer: Signer,
) => {
  const addressWithoutChecksum = token.contractAddress.toLowerCase()
  return new ERC20Token(addressWithoutChecksum, signer, token.symbol, '')
}

export const makeRBTCToken = (signer: Signer, chainId: number): RBTCToken => {
  const rbtcLogo = chainId === MAINNET_CHAINID ? rbtcMainnet : rbtcTestnet
  const rbtcSymbol = chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
  const rbtc = new RBTCToken(signer, rbtcSymbol, rbtcLogo, chainId)

  return rbtc
}
