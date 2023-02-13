import { AxiosInstance } from 'axios'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  AuthenticationTokensType,
  AuthenticationChallengeType,
  RifWalletAuthServiceDependencies,
  onSetInternetCredentials,
  onSaveSignUp,
  onHasSignUp,
  onDeleteSignUp,
  onGetSignUp,
  onResetInternetCredentials
} from './types'

export class RifWalletServicesAuth {
  axiosInstance: AxiosInstance
  wallet: RIFWallet
  did: string
  onSetInternetCredentials: onSetInternetCredentials
  onSaveSignUp: onSaveSignUp
  onHasSignUp: onHasSignUp
  onDeleteSignUp: onDeleteSignUp
  onGetSignUp: onGetSignUp
  onResetInternetCredentials: onResetInternetCredentials
  authClient: string
  constructor(
    axiosInstance: AxiosInstance,
    wallet: RIFWallet,
    dependencies: RifWalletAuthServiceDependencies
  ) {
    this.axiosInstance = axiosInstance
    this.wallet = wallet
    this.did = `did:ethr:rsk:testnet:${wallet?.address}`
    this.onSetInternetCredentials = dependencies.onSetInternetCredentials
    this.onSaveSignUp = dependencies.onSaveSignUp
    this.onHasSignUp = dependencies.onHasSignUp
    this.onDeleteSignUp = dependencies.onDeleteSignUp
    this.onGetSignUp = dependencies.onGetSignUp
    this.onResetInternetCredentials = dependencies.onResetInternetCredentials
    this.authClient = dependencies.authClient
  }

  signup = async () => {
    const {
      data: { challenge },
    } = await this.axiosInstance.get<AuthenticationChallengeType>(
      `/request-signup/${this.did}`,
    )
    const sig = await this.signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>('/signup', {
      response: { sig, did: this.did },
    })
    await this.onSetInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    )
    this.onSaveSignUp({ signup: true })
    return { accessToken, refreshToken }
  }

  signMessage = async (challenge: string) => {
    const message = `URL: ${this.axiosInstance.getUri()}\nVerification code: ${challenge}`
    return await this.wallet?.smartWallet.signer.signMessage(message)
  }

  authenticate = async () => {
    const {
      data: { challenge },
    } = await this.axiosInstance.get<AuthenticationChallengeType>(
      `/request-auth/${this.did}`,
    )
    const sig = await this.signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>('/auth', {
      response: { sig, did: this.did, client: this.authClient },
    })
    await this.onSetInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    )
    return { accessToken, refreshToken }
  }

  login = async () => {
    if (this.onHasSignUp()) {
      const { signup } = this.onGetSignUp()
      if (!signup) {
        return await this.signup()
      } else {
        return await this.authenticate()
      }
    } else {
      return await this.signup()
    }
  }

  refresh = async (oldRefreshToken: string) => {
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>(
      '/refresh-token',
      {
        refreshToken: oldRefreshToken,
      },
    )

    return { accessToken, refreshToken }
  }

  logout = async (accessToken: string) => {
    await this.axiosInstance.post<void>(
      '/logout',
      {},
      { headers: { Authorization: `DIDAuth ${accessToken}` } },
    )
  }

  deleteCredentials = async () => {
    await this.onResetInternetCredentials('jwt')
    this.onDeleteSignUp()
  }
}
