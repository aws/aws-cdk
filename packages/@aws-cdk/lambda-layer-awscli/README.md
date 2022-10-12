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

## Troubleshooting

### WARNING! [ACTION REQUIRED] Your CDK application is using ${this.constructor.name}. Add a dependency on ${AwsCliLayer.assetPackageName}, or the equivalent in your language, to remove this warning

If you see the above message when synthesizing your CDK app, this is because we
have introduced a change to dynamically load the Asset construct used by
AwsCliLayer at runtime. This message appears when the dynamic loading fails due
to restrictions in your environment, and it falls back to using an Asset bundled
in aws-cdk-lib. We plan to remove this fallback, and at that time your
application may be broken. To prevent this, add an explicit dependency on
@aws-cdk/asset-awscli-v1, or the equivalent in your language. If you experience
any issues, please reach out to us by commenting on
https://github.com/aws/aws-cdk/issues/22470.

TODO:
Add language-specific instructions.
