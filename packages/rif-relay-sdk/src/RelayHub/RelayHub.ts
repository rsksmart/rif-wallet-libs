import { ethers } from 'ethers'
import RelayHub from './RelayHub.json'

export const relayHubInterface = new ethers.utils.Interface(RelayHub)
