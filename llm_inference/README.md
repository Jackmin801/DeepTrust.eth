# LLM Inference

```python
conda create -n deeptrust python=3.11 -y && conda activate deeptrust
pip install -r requirements.txt
```

## Package build and upload
```
python setup.py sdist bdist_wheel
twine upload dist/*
```
