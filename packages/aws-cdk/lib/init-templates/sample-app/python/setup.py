import setuptools


with open("README.md") as fp:
    long_description = fp.read()


setuptools.setup(
    name="hello",
    version="0.0.1",

    description="A sample CDK Python app",
    long_description=long_description,
    long_description_content_type="text/markdown",

    author="author",

    package_dir={"": "hello"},
    packages=setuptools.find_packages(where="hello"),

    install_requires=[
        "aws-cdk.core",
        "aws-cdk.aws_iam",
        "aws-cdk.aws_sqs",
        "aws-cdk.aws_sns",
        "aws-cdk.aws_sns_subscriptions",
        "aws-cdk.aws_s3",
    ],

    python_requires=">=3.6",

    classifiers=[
        "Development Status :: 4 - Beta",

        "Intended Audience :: Developers",

        "License :: OSI Approved :: Apache Software License",

        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",

        "Topic :: Software Development :: Code Generators",
        "Topic :: Utilities",

        "Typing :: Typed",
    ],
)
