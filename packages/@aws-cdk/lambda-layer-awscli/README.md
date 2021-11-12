# AWS Lambda Layer with AWS CLI
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


This module exports a single class called `AwsCliLayer` which is a `lambda.Layer` that bundles the AWS CLI.

Usage:

```ts
// AwsCliLayer bundles the AWS CLI in a lambda layer
import { AwsCliLayer } from '@aws-cdk/lambda-layer-awscli';

declare const fn: lambda.Function;
fn.addLayers(new AwsCliLayer(this, 'AwsCliLayer'));
```

The CLI will be installed under `/opt/awscli/aws`.
