import torch
import hashlib

TENSOR_SIG_SAMPLE_SIZE = 1000

def hash_tensor(a: torch.Tensor) -> str:
    if a.numel() < TENSOR_SIG_SAMPLE_SIZE:
        b = a.as_strided(size=(a.numel(),), stride=(1,))
    else:
        step_size = a.numel() // TENSOR_SIG_SAMPLE_SIZE
        b = a.as_strided(size=(TENSOR_SIG_SAMPLE_SIZE,), stride=(step_size,))
    element_str = "".join(f"{x:.3e}" for x in b)
    element_hash = hashlib.md5(element_str.encode("utf-8")).hexdigest()
    return f"{str(a.dtype)[6:]}{str(a.shape)[11:-1]}{a.stride()}<{element_hash}>"
