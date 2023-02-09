# AWS Lambda Layer with AWS CLI
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


This module exports a single class called `AwsCliLayer` which is a `lambda.Layer` that bundles the AWS CLI.

Any Lambda Function that uses this layer must use a Python 3.x runtime.

Usage:

```ts
// AwsCliLayer bundles the AWS CLI in a lambda layer
import { AwsCliLayer } from '@aws-cdk/lambda-layer-awscli';

declare const fn: lambda.Function;
fn.addLayers(new AwsCliLayer(this, 'AwsCliLayer'));
```

The CLI will be installed under `/opt/awscli/aws`.

## Alternatives

This module bundles AWS cli v1. To use AWS cli v2, you can use the
external module [awscdk-asset-awscli](https://github.com/cdklabs/awscdk-asset-awscli/tree/awscli-v2/main).
