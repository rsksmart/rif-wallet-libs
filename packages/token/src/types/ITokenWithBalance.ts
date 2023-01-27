import { IToken } from './IToken'

export interface ITokenWithBalance extends IToken {
  balance: string;
}
