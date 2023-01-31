# RIF Wallet EIP681

Basic and incomplete implementation of [EIP681, URL Format for Transaction Requests](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-681.md). This is a work in progress and only detects the network name and address.

## Basic usage:

```ts
const text = 'ethereum:0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A'

const { address, network } = decodeString(text)

```

## What is missing?

Everything else! Amounts, token to send, etc. Contributions are wellcome as long as tests are included.
