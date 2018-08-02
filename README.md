# AWS Cloud Development Kit (AWS CDK)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiRUlEQk1UWVhQRDduSy9iWWtpa012bmJSU0t2aXpCeEtTT2VpWDhlVmxldVU0ZXBoSzRpdTk1cGNNTThUaUtYVU5BMVZnd1ZhT2FTMWZjNkZ0RE5hSlpNPSIsIml2UGFyYW1ldGVyU3BlYyI6IllIUjJNUEZKY3NqYnR6S3EiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
[![Version](https://badge.fury.io/js/aws-cdk.svg)](https://badge.fury.io/js/aws-cdk)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/awslabs/aws-cdk)

The **AWS Cloud Development Kit (AWS CDK)** is an infrastructure modeling
framework that allows you to define your cloud resources using an imperative
programming interface. The CDK is currently in developer preview. We look
forward to community feedback and collaboration.

[User Guide] |
[Getting Started] |
[API Reference](https://awslabs.github.io/aws-cdk/reference.html) |
[Getting Help](#getting-help)

![Example usage of CDK](screencast.gif)

Developers can use one of the supported programming languages to define reusable
cloud components called [constructs], which are composed together into
[stacks] and [apps].

The [AWS CDK Toolkit] is a command-line tool for interacting with
CDK apps. It allows developers to synthesize artifacts such as AWS
CloudFormation Templates, deploy stacks to development AWS accounts and "diff"
against a deployed stack to understand the impact of a code change.

The [AWS Construct Library] includes a module for each
AWS service with constructs that offer rich APIs that encapsulate the details of
how to use AWS. The AWS Construct Library aims to reduce the complexity and
glue-logic required when integrating various AWS services to achieve your goals
on AWS.

[constructs]: https://awslabs.github.io/aws-cdk/constructs.html
[stacks]: https://awslabs.github.io/aws-cdk/stacks.html
[apps]: https://awslabs.github.io/aws-cdk/apps.html
[User Guide]: https://awslabs.github.io/aws-cdk
[Getting Started]: https://awslabs.github.io/aws-cdk/getting-started.html
[AWS CDK Toolkit]: https://awslabs.github.io/aws-cdk/tools.html#command-line-toolkit-cdk
[AWS Construct Library]: https://awslabs.github.io/aws-cdk/aws-construct-lib.html

## Getting Started

* For a detailed walkthrough, see [Getting Started] in the AWS CDK [User Guide]
* See [Manual Installation](./MANUAL_INSTALLATION.md) for installing the CDK from a signed .zip file

Install the [AWS CDK Toolkit] from npm (requires [Node.js ≥ 8.11.x](https://nodejs.org/en/download)):

```bash
$ npm i -g aws-cdk
```

Initialize a project:

```bash
$ mkdir hello-cdk
$ cd hello-cdk
$ cdk init app --language=typescript
# or
$ cdk init app --language=java
# more languages (coming soon)...
```

Use the `cdk` command-line toolkit to interact with your project:

 * `cdk deploy`: deploys your app into an AWS account
 * `cdk synth`: synthesizes an AWS CloudFormation template for your app
 * `cdk diff`: compares your app with the deployed stack

Read the [docs](https://awslabs.github.io/aws-cdk/):

```bash
$ cdk docs
```

## Getting Help

Please use these community resources for getting help. We use the GitHub issues
for tracking bugs and feature requests.

* Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/aws-cdk)
  and tag it with `aws-cdk`
* Come join the AWS CDK community on [Gitter](https://gitter.im/awslabs/aws-cdk)
* Open a support ticket with [AWS Support](https://console.aws.amazon.com/support/home#/)
* If it turns out that you may have found a bug,
  please open an [issue](https://github.com/awslabs/aws-cdk/issues/new)

## Contributing

We welcome community contributions and pull requests. See
[CONTRIBUTING](./CONTRIBUTING.md) for information on how to set up a development
environment and submit code.

## License

This AWS CDK is distributed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

See [LICENSE](./LICENSE) and [NOTICE](./NOTICE) for more information.
