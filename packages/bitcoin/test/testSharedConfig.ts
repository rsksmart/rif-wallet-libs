import { BIP39 } from '../src'

export const mnemonic = 'rely truly issue ghost elder intact kiss provide project hobby thumb thing blur slender true'

export const mnemonicAddresses = [
  {
    path: 'm/84\'/1\'/0\'/0/0',
    bip84_address: 'tb1qfymt85557xnjm04wtg839vrmq6jx8njh05vhmm',
    bip44_address: 'mzo88FnZi9F1bSHnKZuyosaVbpYJWoZHJX',
    change: 0,
    index: 0,
  },
  {
    path: 'm/84\'/1\'/0\'/0/5',
    bip84_address: 'tb1qz33avpr9jan0tqd7w5sd7kppyr7uc43npy8zjg',
    bip44_address: 'mvk3MgtaDJ39hWigMfpEUPNmFiSW8mt4i9',
    change: 0,
    index: 5,
  },
  {
    path: 'm/84\'/1\'/0\'/0/9',
    bip84_address: 'tb1qv6pjz0ysep3kxkj7hjqeyfy9s00kfnws7wrs8w',
    bip44_address: 'n15BnwPsKngJU2ihRsS5BEHw4jDqdJGhqj',
    change: 0,
    index: 9,
  },
  {
    path: 'm/84\'/1\'/0\'/1/0',
    bip84_address: 'tb1qty8nustsu48vqzq52378cehlg7xjg0mt08te6j',
    bip44_address: 'n4MvgNUY4qjkGrE3uK2ioz9EBaXkSmNrZY',
    change: 1,
    index: 0
  },
  {
    path: 'm/84\'/1\'/0\'/1/5',
    bip84_address: 'tb1qe9rhszcqhmlu3wfdlj6ew89h5xqfmqr4slu3vr',
    bip44_address: 'mtGkjjY9qWUSV49bqc3angkxrWC1423WeX',
    change: 1,
    index: 5
  },
  {
    path: 'm/84\'/1\'/0\'/1/9',
    bip84_address: 'tb1qlu5fr7exmn5nfhv4m8xj2znshvqfx2majhshd9',
    bip44_address: 'mngVGGUbv8aSe1YTbET2WgcW44jjE2NCZu',
    change: 1,
    index: 9
  },
]
export const bip39Instance = new BIP39(mnemonic)
