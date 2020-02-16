## AWS Cloud9 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Usage Example

```ts
import * as cloud9 from '@aws-cdk/aws-cloud9';

// create a cloud9 ec2 environment in a new VPC
new cloud9.EnvironmentEC2(this, 'Cloud9Env');

// or create the cloud9 environment in my default VPC
const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
const c9env = new cloud9.EnvironmentEC2(this, 'Cloud9Env2', {
  vpc,
  instanceType: new ec2.InstanceType('t3.large')
});

// print the Cloud9 IDE URL in the output
new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
```

