# Bitcoin Library

This is a library to handle receiving and sending bitcoin in React Native.

## Install:

```
yarn @rsksmart/rif-wallet-bitcoin
// or
npm i  @rsksmart/rif-wallet-bitcoin
```

## How to use:

The documentation for this is missing and needs much improvement. This repository is under development and is subject to change without notice.

### Basic setup:

Please check the tests in order to acquire more knowledge as to what this library is doing.

In short terms, this library can create a BitcoinNetwork class that will allow the developer to use either BIP84 or BIP44 for their own purposes.

You can create addresses with a BIP39 Mnemonic, and also implement a DefaultFetcher interface that will automatically fetch all the balances for that mnemonic.

## Generating Bitcoin Addresses

To facilitate the generation of Bitcoin addresses, our process consists of several key steps:

### Initialization via Blockbook Instance

Firstly, we initiate the process by relying on a Blockbook instance. We use our rif-wallet-services backend to:

- Fetch the latest indexes available for a given xpub using output descriptors.
- Retrieving these indexes for further use.

### Bitcoin Address Generation via BIP.ts

The central address generation process is managed by our BIP.ts module. It proceeds to generate Bitcoin addresses based on the previously acquired indexes. The resulting Bitcoin addresses are then made available for use.

### The `getAddress()` Method

Within the `getAddress()` method, a Bitcoin address is systematically generated, primarily dependent on the index supplied. The following key steps are involved:

1. **Utilizing the `bip32Root` Property:** The `bip32Root` property, represented as a BIP32 interface instance, signifies the root of a hierarchical deterministic wallet.

2. **Derivation of a Specific Child Path:** The `getAddressDerivation(index)` method, provided by the `PathDerivator` object, derives the exact path corresponding to the provided index.

3. **Resulting `bip32Instance`:** The derived child path results in a `bip32Instance`, representing a distinct key pair within the hierarchical structure.

4. **Extraction of the Public Key:** The public key is extracted from this `bip32Instance`.

5. **Address Generation via the `AddressFactory` Property:** The `AddressFactory` property is employed to generate a Bitcoin address from the extracted public key.

### AddressFactory

The `AddressFactory` component, integral to the address generation process, plays a pivotal role. Within the `getAddress` method of `AddressFactory`, a switch statement is used to determine the specific Bitcoin address type to be generated based on the `purpose` property. The `purpose` can be one of two values:

- If the `purpose` is set to 84, the method generates a Pay-to-Witness-Public-Key-Hash (P2WPKH) address. This address type is commonly associated with Segregated Witness (SegWit) and is returned as a string.

- If the `purpose` is set to 44, the method generates a Pay-to-Public-Key-Hash (P2PKH) address, following the traditional Bitcoin address format. This address is also returned as a string.

- If the `purpose` does not match either 84 or 44, the method throws an error, indicating that the purpose is not recognized or implemented.

In summary, this process enables you to efficiently generate Bitcoin addresses, providing flexibility for various address types. The generated addresses can then be seamlessly integrated into your application as needed.

Do read about BIP 84, BIP 44, BIP 39, BIP 32 for better understanding.

Short explanation:

### BIP 32
- **Title:** Hierarchical Deterministic Wallets (HD Wallets)
- **Description:** Introduces a system for generating a tree of private keys from a single master seed. This allows for a streamlined backup process, where users only need to backup their master seed to restore all associated addresses and private keys.

### BIP 39
- **Title:** Mnemonic code for generating deterministic keys
- **Description:** Specifies the creation of a mnemonic sentence (a set of easy-to-remember words) to represent the master seed for an HD wallet (from BIP 32). This makes the backup process more user-friendly.

### BIP 44
- **Title:** Multi-Account Hierarchy for Deterministic Wallets
- **Description:** Builds on BIP 32 by defining a particular structure for deterministic wallets. It specifies a method for creating multiple accounts and sub-accounts within an HD wallet, allowing users to keep funds separated (e.g., personal vs. business funds).

### BIP 84
- **Title:** Derivation scheme for P2WPKH based accounts
- **Description:** Focuses on deriving SegWit addresses (which start with `bc1` for Bitcoin) from HD wallets. This BIP ensures compatibility and standardization for wallets wanting to use the newer, more efficient SegWit address format.


## Tests:

``
npm run test
``

## Contribution

Yes please.