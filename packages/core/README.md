# RIF Wallet Core

RIF Wallet Core is the wallet library that the connects the UI with the RIF Relay SDK. This class accepts an Ethers Signer that handles the majority of crypto methods. 

## Basic Usage:

```ts
// Create a signer:
const privateKey = ''
const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co')
const signer = new ethers.Wallet(privateKey, provider)

// RIF Relay Config:
const rifRelayConfig = {
  smartWalletFactoryAddress: '0x...'
  relayVerifierAddress: '0x...'
  deployVerifierAddress: '0x...'
  relayServer: 'http://localhost:3000'
}

// On Request function
const onRequest = (request: IncomingRequest) => {
  const { type, payload, returnType, confirm, reject } = onRequest
  // type = SendTransactionRequest | SignMessageRequest | SignTypedDataRequest
  // payload = for a transaction it is the TX details, for signData and signTypedData it is the data & types
  // returnType = for a transaction it is the tx, for signMessage it is the message, for signTypedData it is the data object
  // confirm = function to be called if the user confirms
  // reject = function to be called if the user rejects

  if (allGood) {
    return Promise.Resolve(confirm(returnData))
  }
  return Promise.Resolve(reject('User Rejects'))
}

const rifWallet = await RIFWallet.create(signer, onRequest, rifRelayConfig)

// invoke things as normal:
rifWallet.signTransaction(tx) // sends via RIF Relay
rifWallet.estimateGas(tx)
rifWallet.signMessage('hello world!')
rifWallet.signTypedData(typedDataObject)

// RIF Relay specific things:
rifWallet.deploySmartWallet(payment)

```

## `onRequest` function

The onRequest function is where the UX handles the transaction or interaction. A transaction is sent to the RIFWallet then passed to the `onRequest` method. At this point, the UX can prompt the user to click 'accept' or 'deny'. This means that the wallet can be injected into WalletConnect, and injectedBrowser or used via the UX and when a transaction comes in, it will always prompt the user to accept or deny the action.  
