// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Verifier {
    string private constant DOMAIN_NAME = "EIP-XXXX";
    string private constant DOMAIN_VERSION = "1.0.0";

    bytes32 private immutable COMPOSITE_DOMAIN_SEPARATOR;
    bytes32 private constant COMPOSITE_MESSAGE_TYPEHASH =
        keccak256("CompositeMessage(bytes32 merkleRoot)");

    constructor() {
        COMPOSITE_DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId)"
                ),
                keccak256(bytes(DOMAIN_NAME)),
                keccak256(bytes(DOMAIN_VERSION)),
                block.chainid
            )
        );
    }

    function recoverSignerFromCompositeSignature(
        bytes32 merkleRoot,
        bytes calldata signature
    ) public view returns (address) {
        bytes32 structHash = keccak256(
            abi.encode(COMPOSITE_MESSAGE_TYPEHASH, merkleRoot)
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", COMPOSITE_DOMAIN_SEPARATOR, structHash)
        );
        return recover(digest, signature);
    }

    function verifyMessageInclusion(
        bytes32 messageHash,
        bytes32[] calldata proof,
        bytes32 root
    ) public pure returns (bool) {
        bytes32 computedRoot = messageHash;

        for (uint256 i = 0; i < proof.length; ++i) {
            bytes32 proofElement = proof[i];
            if (computedRoot < proofElement) {
                computedRoot = keccak256(
                    abi.encodePacked(computedRoot, proofElement)
                );
            } else {
                computedRoot = keccak256(
                    abi.encodePacked(proofElement, computedRoot)
                );
            }
        }

        return computedRoot == root;
    }

    function verifyCompositeSignature(
        bytes32 messageHash,
        bytes32[] calldata proof,
        bytes32 merkleRoot,
        bytes calldata signature,
        address expectedSigner
    ) public view returns (bool) {
        if (!verifyMessageInclusion(messageHash, proof, merkleRoot)) {
            return false;
        }

        address signer = recoverSignerFromCompositeSignature(
            merkleRoot,
            signature
        );
        return signer == expectedSigner;
    }

    function recover(
        bytes32 digest,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return ecrecover(digest, v, r, s);
    }
}
