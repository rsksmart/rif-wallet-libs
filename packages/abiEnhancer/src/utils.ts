import { MAINNET_CHAINID } from '@rsksmart/rif-wallet-token'

export function getDefaultNodeUrl(chainId: number) : string {
  return (chainId === MAINNET_CHAINID ? 'https://public-node.rsk.co/' : 'https://public-node.testnet.rsk.co/')
}

export function getRbtcSymbol(chainId: number) : string {
  return chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
}
