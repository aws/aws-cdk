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

## Usage Example

```ts
import * as cloud9 from '@aws-cdk/aws-cloud9';

// create a cloud9 ec2 environment in a new VPC
const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3});
new cloud9.EnvironmentEC2(this, 'Cloud9Env', { vpc });

// or create the cloud9 environment in the default VPC with specific instanceType
const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
new cloud9.EnvironmentEC2(this, 'Cloud9Env2', {
  vpc,
  instanceType: new ec2.InstanceType('t3.large')
});

// or specify in a different subnetSelection 
const c9env = new cloud9.EnvironmentEC2(this, 'Cloud9Env3', {
    vpc,
    subnetSelection: {
      subnetType: ec2.SubnetType.PRIVATE
    }
});

// print the Cloud9 IDE URL in the output
new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
```

