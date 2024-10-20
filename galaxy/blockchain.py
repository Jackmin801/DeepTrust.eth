from web3 import Web3
import json
from abc import ABC, abstractmethod

class BaseBlockchain(ABC):
    def __init__(self, rpc_url, contract_address, abi_path):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        with open(abi_path) as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)

    @abstractmethod
    async def record_verification(self, prompt_hash: str, claimed_hash: str, is_verified: bool, entity: str, model_used: str):
        pass

    @abstractmethod
    async def get_verification_status(self, entity: str, model: str, prompt_hash: str) -> bool:
        pass

class PolygonBlockchain(BaseBlockchain):
    async def record_verification(self, prompt_hash: str, claimed_hash: str, is_verified: bool, entity: str, model_used: str):
        tx_hash = self.contract.functions.recordVerification(
            prompt_hash, claimed_hash, is_verified, entity, model_used
        ).transact()
        return self.w3.eth.wait_for_transaction_receipt(tx_hash)

    async def get_verification_status(self, entity: str, model: str, prompt_hash: str) -> bool:
        return self.contract.functions.getVerificationStatus(
            entity, model, prompt_hash
        ).call()