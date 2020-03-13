## AWS Cloud9 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. Cloud9 comes prepackaged with essential tools for popular programming languages, including JavaScript, Python, PHP, and more, so you don’t need to install files or configure your development machine to start new projects. Since your Cloud9 IDE is cloud-based, you can work on your projects from your office, home, or anywhere using an internet-connected machine. Cloud9 also provides a seamless experience for developing serverless applications enabling you to easily define resources, debug, and switch between local and remote execution of serverless applications. With Cloud9, you can quickly share your development environment with your team, enabling you to pair program and track each other's inputs in real time.


### Creating EC2 Environment

EC2 Environments are defined with `EnvironmentEc2`. To create an EC2 environment in the private subnet, specify `subnetSelection` with private `subnetType`, otherwise, the public subnet from the given VPC will be selected.


```ts
import * as cloud9 from '@aws-cdk/aws-cloud9';

// create a cloud9 ec2 environment in a new VPC
const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3});
new cloud9.EnvironmentEc2(this, 'Cloud9Env', { vpc });

// or create the cloud9 environment in the default VPC with specific instanceType
const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
new cloud9.EnvironmentEc2(this, 'Cloud9Env2', {
  vpc,
  instanceType: new ec2.InstanceType('t3.large')
});

// or specify in a different subnetSelection 
const c9env = new cloud9.EnvironmentEc2(this, 'Cloud9Env3', {
    vpc,
    subnetSelection: {
      subnetType: ec2.SubnetType.PRIVATE
    }
});

// print the Cloud9 IDE URL in the output
new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
```

