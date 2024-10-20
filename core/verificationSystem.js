import { VerificationContract } from '../verification';

export class VerificationSystem {
    constructor(verificationContract) {
        this.verificationContract = verificationContract;
    }

    async verifyLlmOutput(prompt, claimedHash) {
        const computedHash = await this.computeHash(prompt);
        const isVerified = computedHash === claimedHash;
        await this.verificationContract.recordVerification(prompt, claimedHash, isVerified);
        return isVerified;
    }

    async getVerificationStatus(prompt) {
        return await this.verificationContract.getVerificationStatus(prompt);
    }

    async computeHash(prompt) {
        throw new Error('Not implemented');
    }
}
