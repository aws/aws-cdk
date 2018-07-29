# AWS Cloud Development Kit (AWS CDK)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiRUlEQk1UWVhQRDduSy9iWWtpa012bmJSU0t2aXpCeEtTT2VpWDhlVmxldVU0ZXBoSzRpdTk1cGNNTThUaUtYVU5BMVZnd1ZhT2FTMWZjNkZ0RE5hSlpNPSIsIml2UGFyYW1ldGVyU3BlYyI6IllIUjJNUEZKY3NqYnR6S3EiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

The **AWS Cloud Development Kit (AWS CDK)** is an infrastructure modeling framework that allows you to define your cloud resources using an imperative programming interface. The CDK is currently in developer preview. We look forward to community feedback and collaboration.

## Getting Started

### Prerequisites

Make sure you have the following prerequisites installed:

* [Node.js LTS (8.11.x)](https://nodejs.org/en/download) - required for the command-line toolkit and language bindings
* [AWS CLI](https://aws.amazon.com/cli/) - recommended in general, but only needed if you intend to download the release from S3
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

### Extract the installation archive to ~/.cdk

Once you've downloaded the bits, install them into `~/.cdk` and add to your `PATH`:

#### Linux/MacOS (bash/zsh)

```shell
# Unpack to ~/.cdk
rm -fr ~/.cdk
mkdir ~/.cdk
unzip <path-to-zip-file> -d ~/.cdk

# Add to PATH and reload profile
echo 'PATH=$PATH:$HOME/.cdk/bin' >> ~/.bashrc && source ~/.bashrc  # for bash
echo 'PATH=$PATH:$HOME/.cdk/bin' >> ~/.zshrc && source ~/.zshrc    # for zsh
```

#### Windows (PowerShell)

Open an elevated PowerShell terminal ("Run as Administrator"):

```powershell
# Unpack to ~/.cdk
Remove-Item -Force -Recurse ~/.cdk
New-Item -Type Directory ~/.cdk
Expand-Archive -Path <path-to-zip-file> -DestinationPath ~/.cdk

# Add to PATH and reload profile
New-Item -Force -ItemType Directory -Path (Split-Path $PROFILE)
Add-Content -Path $PROFILE -Value '$env:Path = "$env:Path;$env:UserProfile\.cdk\node_modules\.bin"'
Set-ExecutionPolicy Unrestricted
& $PROFILE
```

### Install the command-line toolkit and docs

Install (or update) `aws-cdk` and `aws-cdk-docs` globally

```shell
y-npm install --global aws-cdk aws-cdk-docs # sudo might be needed
```

> `y-npm` is an npm wrapper which allows installing npm modules from a local repository located at `~/.cdk/y/npm`. `y-npm` will fall back to the public npm repository if a module cannot be found locally.

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

### Verifying the integrity of your download

You can verify that your download is complete and correct by validating
its signature against our public signing key. To do so, you need
the following things:

* [GNU Privacy Guard](https://gnupg.org/) needs to be installed.
* Download our public key: https://s3.amazonaws.com/aws-cdk-beta/cdk-team.asc
* Make sure you have downloaded both `aws-cdk-x.y.z.zip`
  and `aws-cdk-x.y.z.zip.sig`.

Then run the following commands:

```shell
gpg --import cdk-team.asc
gpg --verify aws-cdk-x.y.z.zip.sig aws-cdk-x.y.z.zip
```

If everything is correct, the output will contain the line:

```
gpg: Good signature from "AWS CDK Team <aws-cdk@amazon.com>"
```

If you obtained via the above URL, you can ignore the following message:

```
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
```

## Development

See [CONTRIBUTING](./CONTRIBUTING.md).

# License

Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

See [LICENSE](./LICENSE.md) file for license terms.
