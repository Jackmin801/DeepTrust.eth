import Web3 from 'web3';
import fs from 'fs';

class BaseBlockchain {
    constructor(rpcUrl, contractAddress, abiPath) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }

    async recordVerification(promptHash, claimedHash, isVerified, entity, model) {
        throw new Error("Method 'recordVerification' must be implemented.");
    }

    async getVerificationStatus(entity, model, promptHash) {
        throw new Error("Method 'getVerificationStatus' must be implemented.");
    }
}

export { BaseBlockchain };
