# AWS Cloud Development Kit (AWS CDK)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiRUlEQk1UWVhQRDduSy9iWWtpa012bmJSU0t2aXpCeEtTT2VpWDhlVmxldVU0ZXBoSzRpdTk1cGNNTThUaUtYVU5BMVZnd1ZhT2FTMWZjNkZ0RE5hSlpNPSIsIml2UGFyYW1ldGVyU3BlYyI6IllIUjJNUEZKY3NqYnR6S3EiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

The **AWS Cloud Development Kit (AWS CDK)** is an infrastructure modeling framework that allows you to define your cloud resources using an imperative programming interface. The CDK is currently in developer preview. We look forward to community feedback and collaboration.

You can use the CDK to define your cloud architecture in code, by composing and creating reusable cloud components called *constructs*. You build your application using the *AWS CDK Construct Library*, a set of classes that encompass all of AWS' services, and then use the *CDK Toolkit* command-line interface to run your program, convert your code to a CloudFormation template, and execute the deployment. Underneath it all is the *CDK Framework* which defines the APIs for the various components.

Here's what it looks like:

## Installation

### Prerequisites

Make sure you have the following prerequisites installed:

* [Node.js LTS (8.11.x)](https://nodejs.org/en/download) - required for the command-line toolkit and language bindings
* [AWS CLI](https://aws.amazon.com/cli/) - recommended in general, but only needed if you intend to download the release from S3
* The development toolchain of the language you intend to use (TypeScript,
  Python, Java, .NET, Ruby...)

### Getting Started (TypeScript)

Install the toolkit, create a demo project in the current directory, and deploy
it:

```shell
npm install -g aws-cdk
cdk init app --language=typescript
npm run build
cdk deploy
```

### Manual Installation

If you prefer to have complete control over the installation and version
of the CDK, the complete distribution is also available as a single signed
zip file.

[See `MANUAL_INSTALLATION.md` for more information](MANUAL_INSTALLATION.md)

### Viewing Documentation

To view CDK documentation bundled with the release, run:

```shell
cdk docs
```

Or view the [online documentation](http://awslabs.github.io/aws-cdk).

## Development

See [CONTRIBUTING](./CONTRIBUTING.md).

# License

Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

See [LICENSE](./LICENSE.md) file for license terms.
