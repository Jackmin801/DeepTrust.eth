import express from 'express';
import { PolygonBlockchain } from './blockchain/polygonBlockchain';

const app = express();
const port = 3000;

app.use(express.json());

const polygonBlockchain = new PolygonBlockchain(
    'https://rpc.cardona.zkevm-rpc.com', 
    '0xa4a12dd358be32123602ef0ebebb80234523ea74', 
    './blockchain/contracts/llm_verify.json'
);
app.post('/verify', async (req, res) => {
    const { promptHash, claimedHash, isVerified, entity, model } = req.body;
    
    try {
        if (!promptHash || !claimedHash || isVerified === undefined || !entity || !model) {
            throw new Error('Missing required parameters');
        }
        
        console.log('Checking contract...');
        if (!(await polygonBlockchain.checkContract())) {
            throw new Error('Contract not found or not properly deployed');
        }
        
        console.log('Calling recordVerification...');
        const txHash = await polygonBlockchain.recordVerification(promptHash, claimedHash, Boolean(isVerified), entity, model);
        console.log('Transaction hash:', txHash);
        
        res.json({ success: true, transactionHash: txHash });
    } catch (error) {
        console.error('Verification failed:', error);
        res.status(500).json({ 
            error: 'Verification failed', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.get('/verification-status', async (req, res) => {
    const { entity, model, promptHash } = req.query;
    try {
        const status = await polygonBlockchain.getVerificationStatus(entity, model, promptHash);
        res.json({ status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get verification status', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
