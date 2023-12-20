import EventEmitter from 'events'
import { io, Socket } from 'socket.io-client'

import {
  AddressDetailsResponse,
  Header,
  IRifWalletServicesSocket, IServiceChangeEvent,
} from './types'

export class RifWalletServicesSocket
  extends EventEmitter
  implements IRifWalletServicesSocket {
  private rifWalletServicesUrl: string
  private socket: Socket | undefined

  constructor(rifWalletServicesUrl: string) {
    super()
    this.rifWalletServicesUrl = rifWalletServicesUrl
  }

  connect(address: string, chainId: number, headers: Header) {
    try {
      const socket = io(this.rifWalletServicesUrl, {
        path: '/ws',
        forceNew: true,
        reconnectionAttempts: 3,
        timeout: 2000,
        autoConnect: true,
        extraHeaders: headers,
        transports: ['websocket'], // you need to explicitly tell it to use websocket
      })

      socket.on('connect', () => {
        socket.on('change', (event: IServiceChangeEvent) => {
          this.emit('change', event)
        })

        socket.on('init', (event: AddressDetailsResponse) => {
          this.emit('init', event)
        })

        socket.emit('subscribe', {
          address,
          chainId
        })
      })

      this.socket = socket
    } catch (error) {
      console.error('socket error', error)
      if (error instanceof Error) {
        throw new Error(error.toString())
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  isConnected() {
    if (!this.socket) {
      return false
    }

    return this.socket.connected
  }
}
