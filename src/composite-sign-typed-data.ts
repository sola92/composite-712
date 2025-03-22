import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { Eip712TypedData, Eip712TypeDetails } from "web3";
import * as sigUtil from "eth-sig-util";

const COMPOSITE_MESSAGE_DOMAIN_TYPES: Eip712TypeDetails[] = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
];

const COMPOSITE_MESSAGE_DOMAIN_NAME = "EIP-XXXX";
const COMPOSITE_MESSAGE_DOMAIN_VERSION = "1.0.0";

type MerkleProof = ReadonlyArray<`0x${string}`>;

/**
 * Signs multiple EIP-712 typed data messages with a single signature using a Merkle tree.
 *
 * This function creates a Merkle tree from the hashes of multiple EIP-712 typed data messages,
 * then signs the Merkle root to produce a single signature that can validate any of the individual messages.
 *
 * @param args - The arguments for the function
 * @param args.chainId - The chain ID to use in the composite signature domain
 * @param args.privateKey - The private key to sign with
 * @param args.messages - Array of EIP-712 typed data messages to include in the composite signature
 * @returns Object containing the signature, Merkle root, and proofs for each message
 */
async function signCompositeTypedData(args: {
  readonly chainId: number;
  readonly privateKey: Buffer;
  readonly messages: ReadonlyArray<Eip712TypedData>;
}): Promise<{
  readonly signature: `0x${string}`;
  readonly merkleRoot: `0x${string}`;
  readonly proofs: ReadonlyArray<MerkleProof>;
}> {
  const { chainId, privateKey, messages } = args;
  const messageHashes: ReadonlyArray<Buffer> = messages.map(
    ({ message, domain, types }) => {
      const { EIP712Domain, ...typesWithoutDomain } = types;
      const hash = ethers.TypedDataEncoder.hash(
        domain,
        typesWithoutDomain,
        message
      );

      return Buffer.from(hash.slice(2), "hex");
    }
  );

  const tree = new MerkleTree(messageHashes as Array<Buffer>, keccak256, {
    // sort: true,
    sortPairs: true,
    // complete: true,
  });

  const merkleRoot = tree.getRoot().toString("hex");
  const compositeMessage: sigUtil.TypedMessage<{
    EIP712Domain: Eip712TypeDetails[];
    CompositeMessage: Eip712TypeDetails[];
  }> = {
    types: {
      EIP712Domain: COMPOSITE_MESSAGE_DOMAIN_TYPES,
      CompositeMessage: [{ name: "merkleRoot", type: "bytes32" }],
    },
    primaryType: "CompositeMessage",
    domain: {
      name: COMPOSITE_MESSAGE_DOMAIN_NAME,
      version: COMPOSITE_MESSAGE_DOMAIN_VERSION,
      chainId,
    },
    message: {
      merkleRoot: `0x${merkleRoot}`,
    },
  };

  const compositeSignature = sigUtil.signTypedData_v4(privateKey, {
    data: compositeMessage,
  });

  const proofs: ReadonlyArray<MerkleProof> = messageHashes.map((hash) =>
    tree
      .getProof(hash)
      .map((proof) => `0x${proof.data.toString("hex")}` as `0x${string}`)
  );

  return {
    signature: compositeSignature as `0x${string}`,
    merkleRoot: `0x${merkleRoot}`,
    proofs,
  };
}

/**
 * Recovers the signer of a composite typed data signature.
 *
 * This function verifies that a message was included in a composite signature by:
 * 1. Verifying the Merkle proof against the Merkle root
 * 2. Recovering the signer from the composite signature
 *
 * @param args - The arguments for the function
 * @param args.chainId - The chain ID used in the composite signature domain
 * @param args.signature - The signature produced by signCompositeTypedData
 * @param args.merkleRoot - The Merkle root of all signed messages
 * @param args.proof - The Merkle proof for the specific message being verified
 * @param args.message - The EIP-712 typed data message to verify
 * @returns The recovered signer address as a 0x-prefixed string, or undefined if the signature or proof is invalid
 */
function recoverCompositeTypedDataSig(args: {
  readonly chainId: number;
  readonly signature: `0x${string}`;
  readonly merkleRoot: `0x${string}`;
  readonly proof: MerkleProof;
  readonly message: Eip712TypedData;
}): `0x${string}` | undefined {
  const { chainId, signature, message } = args;

  const { EIP712Domain, ...typesWithoutDomain } = message.types;
  const leafHex = ethers.TypedDataEncoder.hash(
    message.domain,
    typesWithoutDomain,
    message.message
  );
  const leaf = Buffer.from(leafHex.slice(2), "hex");

  const proof = args.proof.map((d) => Buffer.from(d.slice(2), "hex"));
  const merkleRoot = Buffer.from(args.merkleRoot.slice(2), "hex");

  function _keccak256(data: Buffer): Buffer {
    return Buffer.from(keccak256(data).slice(2), "hex");
  }

  let computedHash = leaf;
  for (let i = 0; i < proof.length; i++) {
    if (Buffer.compare(computedHash, proof[i]) == -1) {
      computedHash = _keccak256(Buffer.concat([computedHash, proof[i]]));
    } else {
      computedHash = _keccak256(Buffer.concat([proof[i], computedHash]));
    }
  }

  if (Buffer.compare(computedHash, merkleRoot) != 0) {
    return;
  }

  const compositeMessage: sigUtil.TypedMessage<{
    readonly EIP712Domain: Eip712TypeDetails[];
    readonly CompositeMessage: Eip712TypeDetails[];
  }> = {
    types: {
      EIP712Domain: COMPOSITE_MESSAGE_DOMAIN_TYPES,
      CompositeMessage: [{ name: "merkleRoot", type: "bytes32" }],
    },
    primaryType: "CompositeMessage",
    domain: {
      name: COMPOSITE_MESSAGE_DOMAIN_NAME,
      version: COMPOSITE_MESSAGE_DOMAIN_VERSION,
      chainId,
    },
    message: {
      merkleRoot,
    },
  };

  const recovered = sigUtil.recoverTypedSignature({
    data: compositeMessage,
    sig: signature,
  });

  return recovered as `0x${string}`;
}

async function main() {
  const messages: ReadonlyArray<Eip712TypedData> = [
    {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
      },
      primaryType: "Mail",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    },
    {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Transfer: [
          { name: "amount", type: "uint256" },
          { name: "recipient", type: "address" },
        ],
      },
      primaryType: "Transfer",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        amount: "1000000000000000000",
        recipient: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
    },
    {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Transfer: [
          { name: "amount", type: "uint256" },
          { name: "recipient", type: "address" },
        ],
      },
      primaryType: "Transfer",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        amount: "2000000000000000000",
        recipient: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
    },
    {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Transfer: [
          { name: "amount", type: "uint256" },
          { name: "recipient", type: "address" },
        ],
      },
      primaryType: "Transfer",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        amount: "3000000000000000000",
        recipient: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
    },
  ];

  const wallet = ethers.Wallet.createRandom();
  const chainId = 1;
  const result = await signCompositeTypedData({
    chainId,
    privateKey: Buffer.from(wallet.privateKey.slice(2), "hex"),
    messages,
  });

  console.log("Signature", result);

  for (let i = 0; i < messages.length; i++) {
    const recovered = recoverCompositeTypedDataSig({
      chainId,
      signature: result.signature,
      merkleRoot: result.merkleRoot,
      proof: result.proofs[i],
      message: messages[i],
    });
    if (
      recovered == null ||
      recovered.toLowerCase() != wallet.address.toLowerCase()
    ) {
      throw new Error("Recovered address does not match");
    }
  }

  console.log("All messages recovered ✅");
}

main();
