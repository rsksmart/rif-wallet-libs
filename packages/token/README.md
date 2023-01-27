# RIF Wallet Token

This package contains simple classes for ERC20, ERC677, and rBTC assets/tokens. It includes the ABI for ERC20 and ERC677.

## How to use:

```ts
// create a signer:
const privateKey = '' // <-- fill out
const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co')
const signer = new ethers.Wallet(privateKey, provider)

// create an instance:
const token = new ERC20('0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE', signer, 'tRIF', 'rif.svg)

// init a method:
const balance = token.balance('0x3dd03d7d6c3137f1eb7582ba5957b8a2e26f304a)

```

## Test

First, run ganache by doing:

``npx ganache``

then run the tests:

``npm run test``
