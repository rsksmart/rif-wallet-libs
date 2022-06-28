import { BigNumber, BigNumberish, ContractTransaction, Signer } from 'ethers';
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken';
declare class RBTCToken extends BaseToken implements IToken {
    chainId: number;
    address: string;
    constructor(signer: Signer, symbol: string, logo: string, chainId: number);
    getType(): TokenType;
    decimals(): Promise<number>;
    balance(): Promise<BigNumber>;
    transfer(recipientAddress: string, amount: BigNumberish, options?: ITransferOptions): Promise<ContractTransaction>;
}
export { RBTCToken };
