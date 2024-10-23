from typing import List
import dataclasses
from dataclasses import dataclass
import json
from pathlib import Path


@dataclass
class Commit:
    model_name: str
    device: str
    dtype: str
    engine: str
    hashes: List[str]
    completion: List[int]
    input_tokens: int
    generation_config: dict

    def __repr__(self):
        _json = dataclasses.asdict(self)
        return json.dumps(_json)

    def to_file(self, path: str | Path):
        with open(path, "w") as f:
            f.write(repr(self))

    @classmethod
    def from_file(cls, path: str | Path):
        with open(path, "r") as f:
            data = json.load(f)
        return cls(**data)
