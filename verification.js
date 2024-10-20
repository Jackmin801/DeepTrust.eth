export class VerificationContract {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    async recordVerification(prompt, claimedHash, isVerified) {
        const promptHash = this.blockchain.web3.utils.keccak256(prompt);
        return await this.blockchain.recordVerification(promptHash, claimedHash, isVerified);
    }

    async getVerificationStatus(prompt) {
        const promptHash = this.blockchain.web3.utils.keccak256(prompt);
        return await this.blockchain.getVerificationStatus("entityName", "modelName", promptHash);
    }
}
