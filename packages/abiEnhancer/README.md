# ABI Enhancer

The ABI Enhancer package attempts to decode a transaction into a human readable format. There are different strategies for decoding:

- rBTC Transaction - where the data is 0x and the transaction is sending gas from one account to another.
- ERC20 (and variants) Transaction - sending a token from one user to another. In this case the recipient and amout is located in the data field.
- Other Transaction - A contract call interaction. In this case, it queries the publically available list of known method types and attempts to decode it. In this case, the transaction details are not transformed. 

## Basic usage:

```ts
// create a signer:
const privateKey = '' // <-- fill out
const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co')
const signer = new ethers.Wallet(privateKey, provider)

const abiEnhancer = new AbiEnhancer()
const enhanced = abiEnhancer(signer, transactionRequest)
```

## Contribution:

Contributions are welcomed as long as the supporting tests are with it.
