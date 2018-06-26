# AWS Cloud Development Kit (AWS CDK)

The **AWS Cloud Development Kit (AWS CDK)** is a software development framework
for defining cloud infrastructure in code.

## Getting Started

### Prerequisites

Make sure you have the following prerequisites installed:

* [Node.js 8.11.0](https://nodejs.org/download/release/v8.11.0/)
* [AWS CLI](https://aws.amazon.com/cli/) (only needed if you intend to download the release from S3).
* The development toolchain of the language you intend to use (TypeScript,
  Python, Java, .NET, Ruby...)

### Downloading the bits

The CDK is distributed as a single zip file which contains:

1. The CDK command-line toolkit
2. Documentation HTML
2. JavaScript/TypeScript Framework and AWS Constructs
3. Java Framework and AWS Constructs

You can either download the zip file from the
[Releases](http://github.com/awslabs/aws-cdk/releases) page on GitHub or if you
prefer, download them bits from S3 using the URL provided by our team.

To download from S3:

```shell
aws s3 cp <s3-url> ~/aws-cdk.zip
```

### Verifying the integrity of your download

You can verify that the zip file you downloaded is complete and correct by validating
its signature (.zip.sig) against our public signing key. To do so, you need
the following things:

1. Install [GNU Privacy Guard](https://gnupg.org/)
2. Download the CDK public key: https://s3.amazonaws.com/aws-cdk-beta/cdk-team.asc
3. Downloaded both the ZIP file, `aws-cdk-RELEASE.zip` and the SIG file, `aws-cdk-RELEASE.sig`,
   where `RELEASE` is the release you want to install.
4. Run the following commands:
   ```shell
   gpg --import cdk-team.asc
   gpg --verify aws-cdk-RELEASE.zip.sig aws-cdk-RELEASE.zip
   ```

   If everything is correct, the output should contain the line:
   
   ```shell
   gpg: Good signature from "AWS CDK Team <aws-cdk@amazon.com>"
   ```

   If you obtained via the above URL, you can ignore the following message:

   ```shell
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   ```

### Install to ~/.cdk

Once you've downloaded the bits, install them into `~/.cdk`:

```shell
rm -fr ~/.cdk
mkdir ~/.cdk
unzip <path-to-zip-file> -d ~/.cdk
```

Make sure the ~/.cdk/bin is in your `PATH`

```shell
# at the end of your ~/.bashrc or ~/.zshrc file
export PATH=$PATH:$HOME/.cdk/bin
```

Install (or update) `aws-cdk` and `aws-cdk-docs` globally

```shell
y-npm install --global aws-cdk aws-cdk-docs
```

To check which CDK version you have installed:

```shell
cdk --version
```

### Viewing Documentation

To view CDK documentation bundled with the release, run:

```shell
cdk docs
```

### Next steps?

Follow the "Getting Started" guide in CDK docs to initialize your first CDK
project and deploy it to an AWS account.

## Development

See [CONTRIBUTING](./CONTRIBUTING.md).

# License

Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

See [LICENSE](./LICENSE.md) file for license terms.
