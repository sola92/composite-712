import { expect } from "chai";
import { ethers } from "hardhat";
import { Verifier } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { TypedDataDomain, TypedDataField } from "ethers";

describe("SolidityTests", function () {
  let verifier: Verifier;
  let signer: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  const domain: TypedDataDomain = {
    name: "EIP-XXXX",
    version: "1.0.0",
  };

  const types = {
    CompositeMessage: [{ name: "merkleRoot", type: "bytes32" }],
  };

  const messages = [
    { content: "Message 1", timestamp: 1625097600 },
    { content: "Message 2", timestamp: 1625184000 },
    { content: "Message 3", timestamp: 1625270400 },
  ];

  function getMessageHash(message: any): Buffer {
    const encodedMessage = ethers.solidityPacked(
      ["string", "uint256"],
      [message.content, message.timestamp]
    );

    return Buffer.from(keccak256(encodedMessage).slice(2), "hex");
  }

  beforeEach(async function () {
    const VerifierFactory = await ethers.getContractFactory("Verifier");
    verifier = await VerifierFactory.deploy();
    await verifier.waitForDeployment();

    [signer, otherAccount] = await ethers.getSigners();

    const network = await ethers.provider.getNetwork();
    domain.chainId = network.chainId;
  });

  it("should verify a composite signature", async function () {
    const messageHashes = messages.map(getMessageHash);
    const tree = new MerkleTree(messageHashes, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    const compositeMessage = {
      merkleRoot,
    };

    const signature = await signer.signTypedData(
      domain,
      types,
      compositeMessage
    );

    const proof = tree
      .getProof(messageHashes[0])
      .map((p) => `0x${p.data.toString("hex")}`);

    const isValid = await verifier.verifyCompositeSignature(
      `0x${messageHashes[0].toString("hex")}`,
      proof,
      merkleRoot,
      signature,
      signer.address
    );

    expect(isValid).to.be.true;
  });

  it("should reject an invalid proof", async function () {
    const messageHashes = messages.map(getMessageHash);
    const tree = new MerkleTree(messageHashes, keccak256, {
      sortPairs: true,
    });

    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    const compositeMessage = {
      merkleRoot,
    };

    const signature = await signer.signTypedData(
      domain,
      types,
      compositeMessage
    );

    const invalidMessageHash = keccak256(
      ethers.solidityPacked(["string"], ["Invalid message"])
    );

    const proof = tree
      .getProof(messageHashes[0])
      .map((p) => `0x${p.data.toString("hex")}`);

    const isValid = await verifier.verifyCompositeSignature(
      invalidMessageHash,
      proof,
      merkleRoot,
      signature,
      signer.address
    );

    expect(isValid).to.be.false;
  });

  it("should verify all messages in the Merkle tree", async function () {
    const messageHashes = messages.map(getMessageHash);
    const tree = new MerkleTree(messageHashes, keccak256, {
      sortPairs: true,
    });

    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    const compositeMessage = {
      merkleRoot,
    };

    const signature = await signer.signTypedData(
      domain,
      types,
      compositeMessage
    );

    for (let i = 0; i < messageHashes.length; i++) {
      const messageHash = `0x${messageHashes[i].toString("hex")}`;
      const proof = tree
        .getProof(messageHashes[i])
        .map((p) => `0x${p.data.toString("hex")}`);

      const isValid = await verifier.verifyCompositeSignature(
        messageHash,
        proof,
        merkleRoot,
        signature,
        signer.address
      );

      expect(isValid).to.be.true;
    }
  });

  it("should reject a signature from a different signer", async function () {
    const messageHashes = messages.map(getMessageHash);
    const tree = new MerkleTree(messageHashes, keccak256, {
      sortPairs: true,
    });

    const merkleRoot = `0x${tree.getRoot().toString("hex")}`;
    const compositeMessage = {
      merkleRoot: merkleRoot,
    };

    const signature = await otherAccount.signTypedData(
      domain,
      types,
      compositeMessage
    );

    const proof = tree
      .getProof(messageHashes[0])
      .map((p) => `0x${p.data.toString("hex")}`);

    const recoveredSigner = await verifier.recoverSignerFromCompositeSignature(
      merkleRoot,
      signature
    );

    expect(recoveredSigner).to.equal(otherAccount.address);
    expect(recoveredSigner).to.not.equal(signer.address);
  });
});
