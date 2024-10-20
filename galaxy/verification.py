from galaxy.blockchain import *

class VerificationContract:
    def __init__(self, blockchain: any):
        self.blockchain = blockchain

    async def record_verification(self, prompt: str, claimed_hash: str, is_verified: bool):
        prompt_hash = self.blockchain.w3.keccak(text=prompt).hex()
        return await self.blockchain.record_verification(prompt_hash, claimed_hash, is_verified)

    async def get_verification_status(self, prompt: str) -> bool:
        prompt_hash = self.blockchain.w3.keccak(text=prompt).hex()
        return await self.blockchain.get_verification_status(prompt_hash)