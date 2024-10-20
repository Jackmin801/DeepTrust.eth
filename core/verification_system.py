from phala.verifier_network import PhalaVerifierNetwork
from polygon.verification_contract import VerificationContract


class VerificationSystem:
    def __init__(
        self,
        verifier_network: PhalaVerifierNetwork,
        verification_contract: VerificationContract,
    ):
        self.verifier_network = verifier_network
        self.verification_contract = verification_contract

    async def verify_llm_output(self, prompt: str, claimed_hash: str) -> bool:
        computed_hash = await self.verifier_network.compute_hash(prompt)
        is_verified = computed_hash == claimed_hash
        await self.verification_contract.record_verification(
            prompt, claimed_hash, is_verified
        )
        return is_verified

    async def get_verification_status(self, prompt: str) -> bool:
        return await self.verification_contract.get_verification_status(prompt)
