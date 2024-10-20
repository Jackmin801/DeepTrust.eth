// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LLMVerify {
    struct Verification {
        string prompt;
        string promptHash;
        string claimedHash;
        bool isVerified;
        string entity;
        string model;
    }

    mapping(bytes32 => Verification) private verifications;

    function recordVerification(
        string memory prompt,
        string memory promptHash,
        string memory claimedHash,
        bool isVerified,
        string memory entity,
        string memory model
    ) public {
        bytes32 key = keccak256(abi.encodePacked(entity, model, promptHash));
        verifications[key] = Verification(
            prompt,
            promptHash,
            claimedHash,
            isVerified,
            entity,
            model
        );
    }

    function getVerificationStatus(
        string memory entity,
        string memory model,
        string memory promptHash
    ) public view returns (
        string memory prompt,
        string memory,
        string memory claimedHash,
        bool isVerified,
        string memory,
        string memory
    ) {
        bytes32 key = keccak256(abi.encodePacked(entity, model, promptHash));
        Verification memory verification = verifications[key];
        return (
            verification.prompt,
            verification.promptHash,
            verification.claimedHash,
            verification.isVerified,
            verification.entity,
            verification.model
        );
    }
}
