import { BaseBlockchain } from './baseBlockchain';

export class PolygonBlockchain extends BaseBlockchain {
    constructor(rpcUrl, contractAddress, abiPath) {
        super(rpcUrl, contractAddress, abiPath);
        this.initializeContract(contractAddress, abiPath);
    }

    async recordVerification(promptHash, claimedHash, isVerified, entity, model) {
        const accounts = await this.web3.eth.getAccounts();
        const tx = await this.contract.methods.recordVerification(
            promptHash,
            claimedHash,
            isVerified,
            entity,
            model
        ).send({ from: accounts[0] });
        return tx.transactionHash;
    }

    async getVerificationStatus(entity, model, promptHash) {
        return await this.contract.methods.getVerificationStatus(entity, model, promptHash).call();
    }
}
