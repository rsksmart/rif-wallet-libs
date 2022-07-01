"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "name_",
                type: "string",
            },
            {
                internalType: "string",
                name: "symbol_",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "addedValue",
                type: "uint256",
            },
        ],
        name: "increaseAllowance",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
            },
        ],
        name: "decreaseAllowance",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
var _bytecode = "0x60806040523480156200001157600080fd5b50604051620016e4380380620016e4833981810160405281019062000037919062000193565b81600390805190602001906200004f92919062000071565b5080600490805190602001906200006892919062000071565b50505062000337565b8280546200007f90620002a3565b90600052602060002090601f016020900481019282620000a35760008555620000ef565b82601f10620000be57805160ff1916838001178555620000ef565b82800160010185558215620000ef579182015b82811115620000ee578251825591602001919060010190620000d1565b5b509050620000fe919062000102565b5090565b5b808211156200011d57600081600090555060010162000103565b5090565b60006200013862000132846200023a565b62000206565b9050828152602081018484840111156200015157600080fd5b6200015e8482856200026d565b509392505050565b600082601f8301126200017857600080fd5b81516200018a84826020860162000121565b91505092915050565b60008060408385031215620001a757600080fd5b600083015167ffffffffffffffff811115620001c257600080fd5b620001d08582860162000166565b925050602083015167ffffffffffffffff811115620001ee57600080fd5b620001fc8582860162000166565b9150509250929050565b6000604051905081810181811067ffffffffffffffff8211171562000230576200022f62000308565b5b8060405250919050565b600067ffffffffffffffff82111562000258576200025762000308565b5b601f19601f8301169050602081019050919050565b60005b838110156200028d57808201518184015260208101905062000270565b838111156200029d576000848401525b50505050565b60006002820490506001821680620002bc57607f821691505b60208210811415620002d357620002d2620002d9565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61139d80620003476000396000f3fe608060405234801561001057600080fd5b50600436106100c6576000357c010000000000000000000000000000000000000000000000000000000090048063395093511161008e578063395093511461018557806370a08231146101b557806395d89b41146101e5578063a457c2d714610203578063a9059cbb14610233578063dd62ed3e14610263576100c6565b806306fdde03146100cb578063095ea7b3146100e957806318160ddd1461011957806323b872dd14610137578063313ce56714610167575b600080fd5b6100d3610293565b6040516100e09190611032565b60405180910390f35b61010360048036038101906100fe9190610cab565b610325565b6040516101109190611017565b60405180910390f35b610121610343565b60405161012e9190611134565b60405180910390f35b610151600480360381019061014c9190610c5c565b61034d565b60405161015e9190611017565b60405180910390f35b61016f61044e565b60405161017c919061114f565b60405180910390f35b61019f600480360381019061019a9190610cab565b610457565b6040516101ac9190611017565b60405180910390f35b6101cf60048036038101906101ca9190610bf7565b610503565b6040516101dc9190611134565b60405180910390f35b6101ed61054b565b6040516101fa9190611032565b60405180910390f35b61021d60048036038101906102189190610cab565b6105dd565b60405161022a9190611017565b60405180910390f35b61024d60048036038101906102489190610cab565b6106d1565b60405161025a9190611017565b60405180910390f35b61027d60048036038101906102789190610c20565b6106ef565b60405161028a9190611134565b60405180910390f35b6060600380546102a290611298565b80601f01602080910402602001604051908101604052809291908181526020018280546102ce90611298565b801561031b5780601f106102f05761010080835404028352916020019161031b565b820191906000526020600020905b8154815290600101906020018083116102fe57829003601f168201915b5050505050905090565b6000610339610332610776565b848461077e565b6001905092915050565b6000600254905090565b600061035a848484610949565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006103a5610776565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610425576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161041c906110b4565b60405180910390fd5b61044285610431610776565b858461043d91906111dc565b61077e565b60019150509392505050565b60006012905090565b60006104f9610464610776565b848460016000610472610776565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546104f49190611186565b61077e565b6001905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461055a90611298565b80601f016020809104026020016040519081016040528092919081815260200182805461058690611298565b80156105d35780601f106105a8576101008083540402835291602001916105d3565b820191906000526020600020905b8154815290600101906020018083116105b657829003601f168201915b5050505050905090565b600080600160006105ec610776565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156106a9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106a090611114565b60405180910390fd5b6106c66106b4610776565b8585846106c191906111dc565b61077e565b600191505092915050565b60006106e56106de610776565b8484610949565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156107ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e5906110f4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561085e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085590611074565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161093c9190611134565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156109b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109b0906110d4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610a29576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2090611054565b60405180910390fd5b610a34838383610bc8565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610aba576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab190611094565b60405180910390fd5b8181610ac691906111dc565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610b569190611186565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610bba9190611134565b60405180910390a350505050565b505050565b600081359050610bdc81611339565b92915050565b600081359050610bf181611350565b92915050565b600060208284031215610c0957600080fd5b6000610c1784828501610bcd565b91505092915050565b60008060408385031215610c3357600080fd5b6000610c4185828601610bcd565b9250506020610c5285828601610bcd565b9150509250929050565b600080600060608486031215610c7157600080fd5b6000610c7f86828701610bcd565b9350506020610c9086828701610bcd565b9250506040610ca186828701610be2565b9150509250925092565b60008060408385031215610cbe57600080fd5b6000610ccc85828601610bcd565b9250506020610cdd85828601610be2565b9150509250929050565b610cf081611222565b82525050565b6000610d018261116a565b610d0b8185611175565b9350610d1b818560208601611265565b610d2481611328565b840191505092915050565b6000610d3c602383611175565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610da2602283611175565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610e08602683611175565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610e6e602883611175565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206160008301527f6c6c6f77616e63650000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610ed4602583611175565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610f3a602483611175565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610fa0602583611175565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6110028161124e565b82525050565b61101181611258565b82525050565b600060208201905061102c6000830184610ce7565b92915050565b6000602082019050818103600083015261104c8184610cf6565b905092915050565b6000602082019050818103600083015261106d81610d2f565b9050919050565b6000602082019050818103600083015261108d81610d95565b9050919050565b600060208201905081810360008301526110ad81610dfb565b9050919050565b600060208201905081810360008301526110cd81610e61565b9050919050565b600060208201905081810360008301526110ed81610ec7565b9050919050565b6000602082019050818103600083015261110d81610f2d565b9050919050565b6000602082019050818103600083015261112d81610f93565b9050919050565b60006020820190506111496000830184610ff9565b92915050565b60006020820190506111646000830184611008565b92915050565b600081519050919050565b600082825260208201905092915050565b60006111918261124e565b915061119c8361124e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156111d1576111d06112ca565b5b828201905092915050565b60006111e78261124e565b91506111f28361124e565b925082821015611205576112046112ca565b5b828203905092915050565b600061121b8261122e565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015611283578082015181840152602081019050611268565b83811115611292576000848401525b50505050565b600060028204905060018216806112b057607f821691505b602082108114156112c4576112c36112f9565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b61134281611210565b811461134d57600080fd5b50565b6113598161124e565b811461136457600080fd5b5056fea2646970667358221220d23f0bf6a1eca191d26133135c291e08c4b24c3c3a950ed8add977dd205433fa64736f6c63430008000033";
var ERC20__factory = /** @class */ (function (_super) {
    __extends(ERC20__factory, _super);
    function ERC20__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    ERC20__factory.prototype.deploy = function (name_, symbol_, overrides) {
        return _super.prototype.deploy.call(this, name_, symbol_, overrides || {});
    };
    ERC20__factory.prototype.getDeployTransaction = function (name_, symbol_, overrides) {
        return _super.prototype.getDeployTransaction.call(this, name_, symbol_, overrides || {});
    };
    ERC20__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    ERC20__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    ERC20__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ERC20__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ERC20__factory.bytecode = _bytecode;
    ERC20__factory.abi = _abi;
    return ERC20__factory;
}(ethers_1.ContractFactory));
exports.ERC20__factory = ERC20__factory;
