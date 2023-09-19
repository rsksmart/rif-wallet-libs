import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import {
  TransactionResponse,
  TransactionRequest
} from '@ethersproject/abstract-provider'
import axios, { AxiosResponse } from 'axios'
import { BigNumber, BigNumberish, ethers } from 'ethers'

import { SmartWallet } from '../SmartWallet'
import {
  RelayPayment,
  RelayRequest,
  DeployRequest,
  RifRelayConfig,
  ServerConfig,
  ServerEstimate,
  Address
} from './types'
import {
  dataTypeFields,
  getDomainSeparator,
  INTERNAL_TRANSACTION_ESTIMATE_CORRECTION,
  MAX_RELAY_NONCE_GAP,
  validUntilTime,
  ZERO_ADDRESS
} from './helpers'
import ERC20Abi from './erc20abi.json'

import { SmartWalletFactory } from '../SmartWalletFactory'

export class RIFRelaySDK {
  sdkConfig: RifRelayConfig
  serverConfig: ServerConfig | null

  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  smartWalletAddress: string
  eoaAddress: string
  provider: ethers.providers.Provider

  constructor (
    smartWallet: SmartWallet,
    smartWalletFactory: SmartWalletFactory,
    eoaAddress: string,
    sdkConfig: RifRelayConfig
  ) {
    console.log({ sdkConfig })

    // this should not happen but is more for typescript:
    if (!smartWallet.signer.provider) {
      throw new Error('unexpected signer/provider is null')
    }

    this.provider = smartWallet.signer.provider
    this.smartWallet = smartWallet
    this.smartWalletFactory = smartWalletFactory
    this.sdkConfig = sdkConfig

    this.smartWalletAddress = smartWallet.smartWalletAddress
    this.eoaAddress = eoaAddress

    this.serverConfig = null
  }

  static async create (
    signer: Signer,
    rifRelayConfig: RifRelayConfig
  ) {
    const smartWalletFactory = await SmartWalletFactory.create(signer, rifRelayConfig.smartWalletFactoryAddress)
    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const smartWallet = await SmartWallet.create(signer, smartWalletAddress)

    const eoaAddress = await smartWallet.signer.getAddress()

    return new RIFRelaySDK(
      smartWallet,
      smartWalletFactory,
      eoaAddress,
      rifRelayConfig
    )
  }

  private getServerConfig = (): Promise<ServerConfig> => {
    const { relayServer } = this.sdkConfig

    return axios
      .get(`${relayServer}/chain-info`)
      .then(
        (response: AxiosResponse<ServerConfig>) =>
          (this.serverConfig = response.data)
      ).catch(err => {
        console.log({ config: this.sdkConfig, err })
        throw new Error(err)
      })
  }

  private checkTransactionGasPrice = (gasPrice?: BigNumberish):string => {
    if (!gasPrice) {
      return this.serverConfig!.minGasPrice
    }

    // if the transactions gasPrice is less than the servers:
    if (BigNumber.from(gasPrice).lt(BigNumber.from(this.serverConfig!.minGasPrice))) {
      return this.serverConfig!.minGasPrice
    }

    return gasPrice.toString()
  }

  private createRelayRequest = async (
    tx: TransactionRequest,
    payment: RelayPayment
  ): Promise<RelayRequest> => {
    const gasPrice = this.checkTransactionGasPrice(tx.gasPrice)
    const nonce = await this.smartWallet.nonce()
    const tokenGas = await this.estimateTokenTransferCost(
      payment.tokenContract,
      payment.tokenAmount
    )

    const estimated = await this.provider.estimateGas({ ...tx, gasPrice })
    const correction =
      estimated.toNumber() > INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
        ? estimated.sub(INTERNAL_TRANSACTION_ESTIMATE_CORRECTION)
        : estimated
    const internalCallCost = Math.round(correction.toNumber() * 1.01)

    const relayRequest: RelayRequest = {
      request: {
        relayHub: this.serverConfig!.relayHubAddress,
        from: this.eoaAddress,
        to: tx.to || ZERO_ADDRESS,
        data: tx.data?.toString() || '0x',
        value: tx.value?.toString() || '0',
        gas: internalCallCost.toString(),
        nonce: nonce.toString(),
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: tokenGas.toString(),
        validUntilTime: validUntilTime()
      },
      relayData: {
        gasPrice,
        feesReceiver: this.serverConfig!.feesReceiver,
        callForwarder: this.smartWalletAddress,
        callVerifier: this.sdkConfig.relayVerifierAddress
      }
    }

    return relayRequest
  }

  private signRelayRequest = async (
    relayRequest: RelayRequest | DeployRequest,
    isDeployRequest: boolean
  ): Promise<string> => {
    const domain = getDomainSeparator(
      isDeployRequest
        ? this.smartWalletFactory.address
        : this.smartWalletAddress,
      parseInt(this.serverConfig!.chainId, 10)
    )

    const types = dataTypeFields(isDeployRequest)

    const value = {
      ...relayRequest.request,
      relayData: relayRequest.relayData
    }

    const signature = await (
      this.smartWallet.signer as any as TypedDataSigner
    )._signTypedData(domain, types, value)

    return signature
  }

  sendRelayTransaction = async (
    tx: TransactionRequest,
    payment: RelayPayment
  ): Promise<TransactionResponse> => {
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }

    const request = await this.createRelayRequest(tx, payment)
    const signature = await this.signRelayRequest(request, false)

    return this.sendRequestToRelay(request, signature).then((hash: string) =>
      this.provider.getTransaction(hash)
    )
  }

  // The following methods are for deploying a smart wallet
  private createDeployRequest = async (
    payment: RelayPayment
  ): Promise<DeployRequest> => {
    const nonce = await this.smartWalletFactory.getNonce(this.eoaAddress)
    const tokenGas = await this.estimateTokenTransferCost(
      payment.tokenContract,
      payment.tokenAmount
    )

    const deployRequest: DeployRequest = {
      request: {
        relayHub: this.serverConfig!.relayHubAddress,
        from: this.eoaAddress,
        to: ZERO_ADDRESS,
        value: '0',
        nonce: nonce.toString(),
        data: '0x',
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: tokenGas.toString(),
        recoverer: ZERO_ADDRESS,
        index: 0,
        validUntilTime: validUntilTime()
      },
      relayData: {
        gasPrice: this.serverConfig!.minGasPrice,
        feesReceiver: this.serverConfig!.feesReceiver,
        callForwarder: this.smartWalletFactory.address,
        callVerifier: this.sdkConfig.deployVerifierAddress
      }
    }

    return deployRequest
  }

  async sendDeployTransaction (
    payment: RelayPayment
  ): Promise<TransactionResponse> {
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }

    const deployRequest = await this.createDeployRequest(payment)
    const signature = await this.signRelayRequest(deployRequest, true)

    return this.sendRequestToRelay(deployRequest, signature).then(
      (hash: string) => this.provider.getTransaction(hash)
    )
  }

  private prepareDataForServer = (
    request: RelayRequest | DeployRequest,
    signature: string
  ) =>
    this.provider
      .getTransactionCount(this.serverConfig!.relayWorkerAddress)
      .then((relayMaxNonce: number) => {
        const metadata = {
          relayHubAddress: this.serverConfig!.relayHubAddress,
          relayMaxNonce: relayMaxNonce + MAX_RELAY_NONCE_GAP,
          signature
        }

        const relayRequest = {
          ...request,
          request: {
            ...request.request,
            validUntilTime: request.request.validUntilTime
          }
        }

        return { metadata, relayRequest }
      })

  private sendRequestToRelay = (
    request: RelayRequest | DeployRequest,
    signature: string
  ) =>
    new Promise<string>((resolve, reject) =>
      this.prepareDataForServer(request, signature).then(relayRequest =>
        axios
          .post(`${this.sdkConfig.relayServer}/relay`, relayRequest)
          .then((response: AxiosResponse) => {
            if (response.data.error) {
              return reject(response.data.error)
            }

            // if okay...
            return resolve(response.data.txHash)
          })
          .catch(reject)
      )
    )

  estimateTransactionCost = async (
    tx: TransactionRequest,
    tokenContract: Address
  ): Promise<BigNumber> => {
    console.log('SDK estimateTransactionCost')
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }
    console.log('SDK', { config: this.serverConfig })

    const payment = {
      tokenContract,
      tokenAmount: BigNumber.from(0)
    }

    let request
    try {
      const relayRequest = await this.createRelayRequest(tx, payment)
      const signature = await this.signRelayRequest(relayRequest, false)
      request = await this.prepareDataForServer(relayRequest, signature)
    } catch (err) {
      console.log('SDK Error estimating fee:', err)
      throw err
    }

    console.log('SDK: estimating transaction...')

    return await axios
      .post(`${this.sdkConfig.relayServer}/estimate`, request)
      .then((response: AxiosResponse<ServerEstimate>) => {
        console.log('SDK: from server returned', response.data)
        return BigNumber.from(response.data.requiredTokenAmount)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  // the cost to send the token payment from the smartwallet to the fee collector:
  private estimateTokenTransferCost = async (
    tokenAddress: Address,
    feeAmount: BigNumber
  ): Promise<BigNumber> => {
    const erc20 = new ethers.Contract(
      tokenAddress,
      ERC20Abi,
      this.smartWallet.signer
    )

    return erc20.estimateGas
      .transfer(this.serverConfig!.feesReceiver, feeAmount)
  }
}
