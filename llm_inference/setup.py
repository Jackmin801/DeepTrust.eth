from setuptools import setup, find_packages

setup(
    name='deeptrust',
    version='0.0.1',
    packages=find_packages(),
    install_requires=[],
    description='Package for modifying models to include tensor commits',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    author='Jack Min Ong',
    author_email='ongjackm@gmail.com',
    url='https://github.com/Jackmin801/DeepTrust.eth',
    license='MIT',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.11',
)
