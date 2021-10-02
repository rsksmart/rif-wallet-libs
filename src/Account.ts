export class Account {
  privateKey: string

  constructor({ privateKey }: { privateKey: string }) {
    this.privateKey = privateKey
  }
}
