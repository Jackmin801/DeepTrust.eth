from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Initialize FastAPI app
app = FastAPI()

# Load Hugging Face model and tokenizer
model_name = "gpt2"  # Replace with any model you prefer
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Request body for OpenAI compliant API
class RequestModel(BaseModel):
    prompt: str
    completion: str
    temperature: float = 0.7
    max_tokens: int = 20
    n: int = 1
    top_p: float = 0.9

# Response structure for OpenAI API
class ResponseModel(BaseModel):
    completion: str

@app.post("/v1/completions", response_model=ResponseModel)
async def create_completion(request: RequestModel):
    # Encode input prompt
    inputs = tokenizer.encode(request.prompt, return_tensors="pt")
    
    # Generate the output from the model
    with torch.no_grad():
        outputs = model.generate(
            inputs, 
            max_length=request.max_tokens + len(inputs[0]),
            temperature=request.temperature,
            top_p=request.top_p,
            num_return_sequences=request.n,
            pad_token_id=tokenizer.eos_token_id,
            do_sample=True
        )
    
    # Decode and structure response
    decoded_outputs = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    
    # Create an OpenAI-like response
    response = {
        "completion": decoded_outputs[0].strip()
    }
    
    return response

# Run the FastAPI server with Uvicorn (if not running inside another application)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
