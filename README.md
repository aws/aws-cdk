# AWS Cloud Development Kit (AWS CDK)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiRUlEQk1UWVhQRDduSy9iWWtpa012bmJSU0t2aXpCeEtTT2VpWDhlVmxldVU0ZXBoSzRpdTk1cGNNTThUaUtYVU5BMVZnd1ZhT2FTMWZjNkZ0RE5hSlpNPSIsIml2UGFyYW1ldGVyU3BlYyI6IllIUjJNUEZKY3NqYnR6S3EiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
[![Build Status](https://travis-ci.org/awslabs/aws-cdk.svg?branch=master)](https://travis-ci.org/awslabs/aws-cdk)
[![Version](https://badge.fury.io/js/aws-cdk.svg)](https://badge.fury.io/js/aws-cdk)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/awslabs/aws-cdk)

The **AWS Cloud Development Kit (AWS CDK)** is an open-source software development
framework to define cloud infrastructure in code and provision it through AWS CloudFormation.
The CDK integrates fully with AWS services and offers a higher level object-oriented
abstraction to define AWS resources imperatively. Using the CDK’s library of
infrastructure [constructs], you can easily encapsulate AWS best practices in your
infrastructure definition and share it without worrying about boilerplate logic. The
CDK improves the end-to-end development experience because you get to use the power
of modern programming languages to define your AWS infrastructure in a predictable
and efficient manner.

The following languages are currently supported:

* JavaScript, TypeScript
* Python
* Java (Developer Preview)
* .NET (Developer Preview)

[Developer Guide] |
[Tutorial] |
[API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html) |
[Examples](https://github.com/aws-samples/aws-cdk-examples) |
[Getting Help](#getting-help)

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

[constructs]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html
[stacks]: https://docs.aws.amazon.com/cdk/latest/guide/apps_and_stacks.html#stacks
[apps]: https://docs.aws.amazon.com/cdk/latest/guide/apps_and_stacks.html#apps
[Developer Guide]: https://docs.aws.amazon.com/cdk/latest/guide
[Tutorial]: https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#hello_world_tutorial
[AWS CDK Toolkit]: https://docs.aws.amazon.com/cdk/latest/guide/tools.html
[AWS Construct Library]: https://docs.aws.amazon.com/cdk/latest/guide/aws_construct_lib.html

## Getting Started

* See [Manual Installation](./MANUAL_INSTALLATION.md) for installing the CDK from a signed .zip file

Install or update the [AWS CDK Toolkit] from npm (requires [Node.js ≥ 8.11.x](https://nodejs.org/en/download)):

```bash
$ npm i -g aws-cdk
```

Initialize a project:

```bash
$ mkdir hello-cdk
$ cd hello-cdk
$ cdk init app --language=typescript (or --language=java, ...)
$ cdk deploy
```

Use the `cdk` command-line toolkit to interact with your project:

 * `cdk deploy`: deploys your app into an AWS account
 * `cdk synth`: synthesizes an AWS CloudFormation template for your app
 * `cdk diff`: compares your app with the deployed stack

For a detailed walkthrough, see [Tutorial] in the AWS CDK [Developer Guide].

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

The AWS CDK is distributed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

See [LICENSE](./LICENSE) and [NOTICE](./NOTICE) for more information.
