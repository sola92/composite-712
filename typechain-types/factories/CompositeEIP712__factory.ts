/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  CompositeEIP712,
  CompositeEIP712Interface,
} from "../CompositeEIP712";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "recoverSignerFromCompositeSignature",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "verifyCompositeSignature",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
    ],
    name: "verifyMessageInclusion",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604080518082018252601981527f4549502d585858582d436f6d706f736974654d657373616765000000000000006020918201528151808301835260058152640312e302e360dc1b9082015281517fc2f8787176b8ac6bf7215b4adcc1e069bf4ab82d9ab1df05a57a91d425935b6e818301527f52ccc4043a4224385b40f3e15fc944879b0448416742f04f84f20bae055c0b20818401527f06c015bd22b4c69690933c1058878ebdfef31f9aaae40bbe86d8a09fe1b2972c60608201524660808083019190915283518083038201815260a090920190935280519101209081905261063061010b60003960006101ee01526106306000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063bcea010e14610046578063cb5017571461006e578063f8c3ddd414610081575b600080fd5b6100596100543660046104af565b6100ac565b60405190151581526020015b60405180910390f35b61005961007c366004610526565b6100e8565b61009461008f366004610576565b610198565b6040516001600160a01b039091168152602001610065565b60006100b98585856100e8565b6100c5575060006100e0565b60006100d18484610198565b6001600160a01b031615159150505b949350505050565b600083815b845181101561018d57600085828151811061010a5761010a6105bd565b602002602001015190508083101561014d57604080516020810185905290810182905260600160405160208183030381529060405280519060200120925061017a565b60408051602081018390529081018490526060016040516020818303038152906040528051906020012092505b5080610185816105d3565b9150506100ed565b509091149392505050565b604080517f7c2dbae0f2b0a655cfc0823536a5fe4ab8b7f73fcbf1908c4f43e26bbdea08dc60208083019190915281830185905282518083038401815260608301845280519082012061190160f01b60808401527f0000000000000000000000000000000000000000000000000000000000000000608284015260a28084018290528451808503909101815260c290930190935281519101206000919061023f818561024a565b925050505b92915050565b600081516041146102a15760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207369676e6174757265206c656e6774680000000000000000604482015260640160405180910390fd5b60208201516040830151606084015160001a7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156102e75760009350505050610244565b8060ff16601b141580156102ff57508060ff16601c14155b156103105760009350505050610244565b60408051600081526020810180835288905260ff831691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa158015610363573d6000803e3d6000fd5b5050604051601f190151979650505050505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156103b7576103b7610378565b604052919050565b600082601f8301126103d057600080fd5b8135602067ffffffffffffffff8211156103ec576103ec610378565b8160051b6103fb82820161038e565b928352848101820192828101908785111561041557600080fd5b83870192505b848310156104345782358252918301919083019061041b565b979650505050505050565b600082601f83011261045057600080fd5b813567ffffffffffffffff81111561046a5761046a610378565b61047d601f8201601f191660200161038e565b81815284602083860101111561049257600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080608085870312156104c557600080fd5b84359350602085013567ffffffffffffffff808211156104e457600080fd5b6104f0888389016103bf565b945060408701359350606087013591508082111561050d57600080fd5b5061051a8782880161043f565b91505092959194509250565b60008060006060848603121561053b57600080fd5b83359250602084013567ffffffffffffffff81111561055957600080fd5b610565868287016103bf565b925050604084013590509250925092565b6000806040838503121561058957600080fd5b82359150602083013567ffffffffffffffff8111156105a757600080fd5b6105b38582860161043f565b9150509250929050565b634e487b7160e01b600052603260045260246000fd5b6000600182016105f357634e487b7160e01b600052601160045260246000fd5b506001019056fea264697066735822122090f53e3bb79b4a2f7cd4a1a164147225dacab0cdee3284226abed54828d76c9d64736f6c63430008140033";

type CompositeEIP712ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CompositeEIP712ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CompositeEIP712__factory extends ContractFactory {
  constructor(...args: CompositeEIP712ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      CompositeEIP712 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CompositeEIP712__factory {
    return super.connect(runner) as CompositeEIP712__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CompositeEIP712Interface {
    return new Interface(_abi) as CompositeEIP712Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CompositeEIP712 {
    return new Contract(address, _abi, runner) as unknown as CompositeEIP712;
  }
}
