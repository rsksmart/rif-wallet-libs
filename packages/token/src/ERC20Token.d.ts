import { BigNumber, BigNumberish, ContractTransaction, Signer } from 'ethers'
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken'
declare class ERC20Token extends BaseToken implements IToken {
    private tokenContract;
    address: string;
    constructor(address: string, signer: Signer, symbol: string, logo: string);
    getType(): TokenType;
    decimals(): Promise<number>;
    balance(): Promise<BigNumber>;
    transfer(recipientAddress: string, amount: BigNumberish, options?: ITransferOptions): Promise<ContractTransaction>;
}
export { ERC20Token }
