# RIF Relay Light SDK

This is a light implementation of the client RIF Relay SDK built using ethers.

## Install:

```
yarn @rsksmart/rif-relay-light-sdk
npm i  @rsksmart/rif-relay-light-sdk
```

## How to use:

The documentation for this is missing and needs much improvement. This repo is under development and is subject to change without notice.

```ts
import RIFRelaySDK from '@rsksmart/rif-relay-light-sdk
import ethers from 'ethers'

// ...

// fill out the following:
const privateKey = ''

const relayConfig = {
  factoryAddress: '',
  relayVerifierAddress: '',
  deployVerifierAddress: '',
  relayServer: ''
}

// ...

// Create the Signer: 
const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co')
const signer = new ethers.Wallet(privateKey, provider)

// Create the SDK:
const relaySDK = await sdk.RIFRelaySDK.create(signer, relayConfig)

// Some variables that you might need:
const eoaAddress = relaySDK.eoaAddress
const smartWalletAddress = relaySDK.smartWalletAddress
const isDeployed = await relaySDK.smartWalletFactory.isDeployed()

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

// to deploy the smartwallet for the user:
const deployTx = await relaySDK.sendDeployTransaction(payment)
console.log(deployTx)

// OR to relay a transaction if the smartcontract is already deployed:
const relayTx = await relaySDK.sendRelayTransaction(sendFiveRifToJesseTx, payment)
console.log(relayTx)
```

## Tests:

There are no tests for this library at this time. This tech debt is known.

## Contribution

Yes please.
