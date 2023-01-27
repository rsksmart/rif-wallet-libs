import { JsonRpcProvider } from '@ethersproject/providers'
import { ERC20Token, ERC677__factory, RBTCToken, tenPow } from '@rsksmart/rif-wallet-token'
import { TEST_TOKEN_DECIMALS } from '@rsksmart/rif-wallet-token/test/utils'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'

export const testJsonRpcProvider = new JsonRpcProvider('http://localhost:8545')

export const getSigner = (index = 0) => {
  return testJsonRpcProvider.getSigner(index)
}

export const deployTestTokens = async (
  accountSigner: Signer,
  initialBalance: BigNumber = BigNumber.from(200),
) => {
  const rbtcSigner = getSigner(7)
  const deploySignerAddress = await accountSigner.getAddress()

  // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
  const initialSupply = initialBalance.mul(tenPow(TEST_TOKEN_DECIMALS))
  const erc677Factory = new ERC677__factory(accountSigner)
  const firstErc20 = await erc677Factory.deploy(
    deploySignerAddress,
    initialSupply,
    'FIRST_TEST_ERC20',
    'FIRST_TEST_ERC20',
  )

  const secondErc20 = await erc677Factory.deploy(
    deploySignerAddress,
    initialSupply,
    'SECOND_TEST_ERC20',
    'SECOND_TEST_ERC20',
  )

  const firstErc20Token = new ERC20Token(
    firstErc20.address,
    accountSigner,
    'FIRST_TEST_ERC20',
    'logo.jpg',
  )

  const secondErc20Token = new ERC20Token(
    secondErc20.address,
    accountSigner,
    'SECOND_TEST_ERC20',
    'logo.jpg',
  )

  const rbtcToken = new RBTCToken(rbtcSigner, 'TRBTC', 'logo.jpg', 31)

  return {
    firstErc20Token,
    secondErc20Token,
    rbtcToken,
  }
}
