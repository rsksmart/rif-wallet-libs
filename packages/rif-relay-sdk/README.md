# RIF Relay Light SDK

This is a light implementation of the client RIF Relay SDK built using ethers. This is experimential and is subject to change. Please report any issues that you may find.

## Install:

```
yarn @rsksmart/rif-relay-light-sdk
// or
npm i  @rsksmart/rif-relay-light-sdk
```

## How to use:

The documentation for this is missing and needs much improvement. This repo is under development and is subject to change without notice.

### Basic setup:

```ts
import RIFRelaySDK from '@rsksmart/rif-relay-light-sdk
import ethers from 'ethers'

// ...

// fill out the following:
const privateKey = ''

const relayConfig = {
  smartWalletFactoryAddress: '',
  relayVerifierAddress: '',
  deployVerifierAddress: '',
  relayServer: ''
}

// Create the Signer: 
const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co')
const signer = new ethers.Wallet(privateKey, provider)

// Create the SDK:
const relaySDK = await sdk.RIFRelaySDK.create(signer, relayConfig)

// Some variables that you might need:
const eoaAddress = relaySDK.eoaAddress
const smartWalletAddress = relaySDK.smartWalletAddress
const isDeployed = await relaySDK.smartWalletFactory.isDeployed()
```

### Deploy the SmartWallet:

The server this is being tested with offers free deployment transactions, if your server costs, then you may need to estimate the cost and send it. Below we are sending 0:

```ts
// Deploy the smartwallet for the user.
const freePayment = {
  tokenContract: RIF_TOKEN_ADDRESS_TESTNET,
  tokenAmount: '0'
}

const deployTx = await relaySDK.sendDeployTransaction(freePayment)
console.log(deployTx)
```

### Estimate and Relay a Transaction:

```ts
// A simple ERC20 transaction:
const sendFiveRifToJesseTx = {
  to: RIF_TOKEN_ADDRESS_TESTNET,
  data: '0xa9059cbb0000000000000000000000003dd03d7d6c3137f1eb7582ba5957b8a2e26f304a0000000000000000000000000000000000000000000000004563918244f40000'
}

// estimate a transaction cost:
const estimateFee = await relaySDK.estimateTransactionCost(sendFiveRifToJesseTx, RIF_TOKEN_ADDRESS_TESTNET)
const payment = {
    tokenContract: RIF_TOKEN_ADDRESS_TESTNET,
    tokenAmount: estimateFee.toString()
  }

// relay a transaction if the smartcontract is already deployed:
const relayTx = await relaySDK.sendRelayTransaction(sendFiveRifToJesseTx, payment)

console.log(relayTx)
```

## Tests:

There are no tests for this library at this time. This tech debt is known, your help is appreciated.

## Contribution

Yes please.
