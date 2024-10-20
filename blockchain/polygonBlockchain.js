import { BaseBlockchain } from './baseBlockchain';

export class PolygonBlockchain extends BaseBlockchain {
    constructor(rpcUrl, contractAddress, abiPath) {
        super(rpcUrl, contractAddress, abiPath);
    }

    async checkContract() {
        try {
            const code = await this.web3.eth.getCode(this.contract.options.address);
            if (code === '0x' || code === '0x0') {
                console.error('No contract found at the specified address');
                return false;
            }
            console.log('Contract found at the specified address');

            try {
                const result = await this.contract.methods.getVerificationStatus('test', 'test', 'test').call();
                console.log('getVerificationStatus test result:', result);
            } catch (viewError) {
                console.error('Error calling view function:', viewError);
            }

            return true;
        } catch (error) {
            console.error('Error checking contract:', error);
            return false;
        }
    }

    async recordVerification(prompt, claimedHash, isVerified, entity, model) {
        const gasPrice = await this.web3.eth.getGasPrice();     
        const promptHash = this.web3.utils.sha3(prompt);
        const data = this.contract.methods.recordVerification(
            prompt,
            promptHash,
            claimedHash,
            isVerified,
            entity,
            model
        ).encodeABI();
    
        try {
            console.log('Estimating gas...');
            const gasEstimate = await this.web3.eth.estimateGas({
                to: this.contract.options.address,
                data: data,
                from: this.web3.eth.defaultAccount
            });
            console.log('Gas estimate:', gasEstimate);
    
            console.log('Signing transaction...');
            const signedTx = await this.web3.eth.accounts.signTransaction(
                {
                    to: this.contract.options.address,
                    data: data,
                    gas: gasPrice,
                    gasPrice: gasPrice,
                    from: '0xAF378FbcDAb437c11A4df42161D1F4bF5d6CE43b'
                },
                '5f10a09a772ce9424971b451ec2b4c08be1dd6c3dce34ed49ebd406a46932387'
            );
    
            console.log('Sending signed transaction...');
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receipt:', receipt);
            return receipt.transactionHash;
        } catch (error) {
            console.error('Transaction failed:', error);
            if (error.message.includes('invalid opcode')) {
                console.error('Invalid opcode error. This might be due to a contract execution issue.');
                try {
                    const result = await this.web3.eth.call({
                        to: this.contract.options.address,
                        data: data,
                        from: this.web3.eth.defaultAccount
                    });
                    console.error('Call result:', result);
                } catch (callError) {
                    console.error('Call error:', callError);
                }
            }
            throw error;
        }
    }

    async getVerificationStatus(entity, model, promptHash) {
        try {
            const result = await this.contract.methods.getVerificationStatus(entity, model, promptHash).call();
            console.log('Verification status:', result);
            return result;
        } catch (error) {
            console.error('Error getting verification status:', error);
            throw error;
        }
    }
}
