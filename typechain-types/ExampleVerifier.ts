/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface ExampleVerifierInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DOMAIN_SEPARATOR"
      | "debugGenerateMessageHash"
      | "placeOrder"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DOMAIN_SEPARATOR",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "debugGenerateMessageHash",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "placeOrder",
    values: [BytesLike, AddressLike, BytesLike, BytesLike, BytesLike[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "DOMAIN_SEPARATOR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "debugGenerateMessageHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "placeOrder", data: BytesLike): Result;
}

export interface ExampleVerifier extends BaseContract {
  connect(runner?: ContractRunner | null): ExampleVerifier;
  waitForDeployment(): Promise<this>;

  interface: ExampleVerifierInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  DOMAIN_SEPARATOR: TypedContractMethod<[], [string], "view">;

  debugGenerateMessageHash: TypedContractMethod<
    [orderId: BytesLike, user: AddressLike],
    [string],
    "view"
  >;

  placeOrder: TypedContractMethod<
    [
      orderId: BytesLike,
      user: AddressLike,
      signature: BytesLike,
      merkleRoot: BytesLike,
      proof: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DOMAIN_SEPARATOR"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "debugGenerateMessageHash"
  ): TypedContractMethod<
    [orderId: BytesLike, user: AddressLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "placeOrder"
  ): TypedContractMethod<
    [
      orderId: BytesLike,
      user: AddressLike,
      signature: BytesLike,
      merkleRoot: BytesLike,
      proof: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
