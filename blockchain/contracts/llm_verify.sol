// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificationStore {
    struct Verification {
        string prompt;
        string promptHash;
        string claimedHash;
        bool isVerified;
        string entity;
        string model;
    }

    mapping(bytes32 => Verification) private verifications;

    event VerificationRecorded(
        string prompt,
        string promptHash, 
        string claimedHash,
        bool indexed isVerified,
        string indexed entity,
        string indexed model
    );

    function recordVerification(
        string memory prompt,
        string memory promptHash, 
        string memory claimedHash,
        bool isVerified,
        string memory entity,
        string memory model
    ) public {
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(bytes(promptHash).length > 0, "Prompt hash cannot be empty");
        require(bytes(claimedHash).length > 0, "Claimed hash cannot be empty");
        require(bytes(entity).length > 0, "Entity cannot be empty");
        require(bytes(model).length > 0, "Model cannot be empty");

        bytes32 verificationKey = keccak256(abi.encodePacked(entity, model, promptHash));
        verifications[verificationKey] = Verification(prompt, promptHash, claimedHash, isVerified, entity, model);
        emit VerificationRecorded(prompt, promptHash, claimedHash, isVerified, entity, model);
    }

    function getVerificationStatus(
        string memory entity,
        string memory model,
        string memory promptHash 
    ) public view returns (bool) {
        bytes32 verificationKey = keccak256(abi.encodePacked(entity, model, promptHash));
        return verifications[verificationKey].isVerified;
    }
}