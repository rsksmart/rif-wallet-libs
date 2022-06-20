import { Wallet } from 'ethers';
declare type Mnemonic = string;
declare type DerivedPaths = {
    [derivatoinPath: string]: boolean;
};
declare type LastDerivedAccountIndex = {
    [chainId: number]: number;
};
declare type KeyManagementSystemState = {
    lastDerivedAccountIndex: LastDerivedAccountIndex;
    derivedPaths: DerivedPaths;
};
export declare type SaveableWallet = {
    derivationPath: string;
    wallet: Wallet;
    save(): void;
};
interface IKeyManagementSystem {
    nextWallet(chainId: number): SaveableWallet;
    addWallet(derivationPath: string): SaveableWallet;
    removeWallet(derivationPath: string): void;
}
/**
 * The Key Management System will derive accounts for a given mnemonic. It allows
 * two type of derivations:
 * - By chain id (nextWallet): it will use an incremental account_index based on BIP-44
 * - Arbitrary derivation paths (addWallet): it will derive the account for the given
 *   path, affecting the accounts by chain id. If an account of a chain is
 *   added, it will be skiped when adding by chain id
 * Both methods will return a { derivationPath, wallet, save } object that can be used
 * to deffer saving the account in the KMS. This can be used to show the user the account
 * before storing it.
 * Use removeWallet to remove it from the KMS. It can be added back by adding as and
 * arbitrary accounts
 * Use serialize/fromSerialized to store the KMS
 */
export declare class KeyManagementSystem implements IKeyManagementSystem {
    state: KeyManagementSystemState;
    mnemonic: Mnemonic;
    private constructor();
    /**
     * Factory method: generates a mnemonic and initializes the
     * Key Management System
     * @returns a new Key Management System with a new mnemonic
     */
    static create(): KeyManagementSystem;
    /**
     * Factory method: use this method to import a wallet and the
     * used derivation paths
     * @param mnemonic a mnemonic phrase
     * @param state the state of the Key Management System
     * @returns A Key Management System with the given mnemonic and state
     */
    static import(mnemonic: Mnemonic): KeyManagementSystem;
    /**
     * Use this method to recover a stored serialized wallet
     * @param serialized the serialized string
     * @returns the KeyManagementSystem that was serialized
     */
    static fromSerialized(serialized: string): {
        kms: KeyManagementSystem;
        wallets: Wallet[];
    };
    /**
     * Use this method to get a string to be stored and recovered
     * @returns a serialized wallet
     */
    serialize(): string;
    private deriveWallet;
    /**
     * Get the next wallet for the given chainId
     * @param chainId EIP-155 chain Id
     * @returns a savable account
     */
    nextWallet(chainId: number): SaveableWallet;
    /**
     * Get tehe account for an arbitrary derivation path
     * @param derivationPath an arbitrary derivation path
     * @returns a savable wallet
     */
    addWallet(derivationPath: string): SaveableWallet;
    /**
     * Remove a wallet from the Key Management System
     * @param derivationPath the derivation path of the wallet to be removed
     */
    removeWallet(derivationPath: string): void;
}
export {};
