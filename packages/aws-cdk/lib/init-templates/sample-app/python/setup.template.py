import setuptools


with open("README.md") as fp:
    long_description = fp.read()


setuptools.setup(
    name="%name.PythonModule%",
    version="0.0.1",

    description="A sample CDK Python app",
    long_description=long_description,
    long_description_content_type="text/markdown",

    author="author",

    package_dir={"": "%name.PythonModule%"},
    packages=setuptools.find_packages(where="%name.PythonModule%"),

    install_requires=[
        "aws-cdk.core==%cdk-version%",
        "aws-cdk.aws_iam==%cdk-version%",
        "aws-cdk.aws_sqs==%cdk-version%",
        "aws-cdk.aws_sns==%cdk-version%",
        "aws-cdk.aws_sns_subscriptions==%cdk-version%",
        "aws-cdk.aws_s3==%cdk-version%",
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
