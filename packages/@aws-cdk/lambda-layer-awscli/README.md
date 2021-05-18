# AWS Lambda Layer with AWS CLI
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


This module exports two classes called `AwsCliLayer` & `AwsCliV2Layer` which is a `lambda.Layer` that bundles the AWS CLI.

Usage:

```ts
const fn = new lambda.Function(...);
fn.addLayers(new AwsCliV2Layer(stack, 'AwsCliV2Layer'));
```

The CLI will be installed under `/opt/awscli/aws`.
