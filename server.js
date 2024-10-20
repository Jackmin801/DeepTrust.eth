import express from 'express';
import { PolygonBlockchain } from './blockchain/polygonBlockchain';

const app = express();
const port = 3000;

app.use(express.json());

const polygonBlockchain = new PolygonBlockchain(
    'https://rpc-amoy.polygon.technology', 
    'dsafadsfhadskjfhadjskl', 
    './blockchain/contracts/llm_verify.json'
);

app.post('/verify', async (req, res) => {
    const { prompt, claimedHash, entity, model } = req.body;
    try {
        const isVerified = await polygonBlockchain.recordVerification(prompt, claimedHash, true, entity, model);
        res.json({ isVerified });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed', details: error.message });
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
