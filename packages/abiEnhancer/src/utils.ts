import { BytesLike, hexDataSlice } from '@ethersproject/bytes'

export function getDefaultNodeUrl(chainId: number) : string {
  switch (chainId) {
    case 30:
      return 'https://public-node.rsk.co/'
    case 31:
      return 'https://public-node.testnet.rsk.co/'
    default:
      throw new Error('Unsupported network')
  }
}

export function getNativeCryptoCurrencySymbol(chainId: number) : string {
  switch (chainId) {
    case 30:
      return 'RBTC'
    case 31:
      return 'TRBTC'
    default:
      throw new Error('Unsupported network')
  }
}

export const getHexSig = (data: BytesLike) => {
  const firstFourBytes = hexDataSlice(data, 0, 4)
  const functionHexWithout0x = firstFourBytes.substring(2)

  return functionHexWithout0x
}
