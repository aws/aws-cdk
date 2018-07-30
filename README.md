# AWS Cloud Development Kit (AWS CDK)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiRUlEQk1UWVhQRDduSy9iWWtpa012bmJSU0t2aXpCeEtTT2VpWDhlVmxldVU0ZXBoSzRpdTk1cGNNTThUaUtYVU5BMVZnd1ZhT2FTMWZjNkZ0RE5hSlpNPSIsIml2UGFyYW1ldGVyU3BlYyI6IllIUjJNUEZKY3NqYnR6S3EiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

The **AWS Cloud Development Kit (AWS CDK)** is an infrastructure modeling framework that allows you to define your cloud resources using an imperative programming interface. The CDK is currently in developer preview. We look forward to community feedback and collaboration.

Developers can use one of the supported programming languages to define
reusable cloud components called **constructs**, which are composed
together to form **Apps**. Apps are synthesized to AWS
CloudFormation Templates and deployed to the AWS Cloud using the **CDK
Command Line Toolkit**.

The CDK is shipped with a rich library of constructs called the **AWS
Construct Library**, which includes constructs for all AWS services.

You will end up writing code that looks like this:

```ts
const queue = new sqs.Queue(this, 'MyQueue', {
    visibilityTimeoutSec: 300
});

const topic = new sns.Topic(this, 'MyTopic');

topic.subscribeQueue(queue);
```

The following screencast shows the experience of installing and working with the CDK:

![Example usage of CDK](screencast.gif)

## Installation

### Prerequisites

Make sure you have [Node.js LTS (8.11.x)](https://nodejs.org/en/download) installed.

### Getting Started

Install the toolkit, create a demo project in the current directory, and deploy
it:

```shell
npm install -g aws-cdk
cdk init app --language=typescript   # or java
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

See [LICENSE](./LICENSE) file for license terms.
