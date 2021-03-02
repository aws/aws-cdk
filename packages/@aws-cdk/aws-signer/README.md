# AWS::Signer Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

AWS Signer is a fully managed code-signing service to ensure the trust and integrity of your code. Organizations validate code against
a digital signature to confirm that the code is unaltered and from a trusted publisher. For more information, see [What Is AWS
Signer?](https://docs.aws.amazon.com/signer/latest/developerguide/Welcome.html)

## Table of Contents

- [Signing Platform](#signing-platform)
- [Signing Profile](#signing-profile)

## Signing Platform

A signing platform is a predefined set of instructions that specifies the signature format and signing algorithms that AWS Signer should use
to sign a zip file. For more information go to [Signing Platforms in AWS Signer](https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html).

AWS Signer provides a pre-defined set of signing platforms. They are available in the CDK as -

```ts
Platform.AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA
Platform.AWS_LAMBDA_SHA384_ECDSA
Platform.AMAZON_FREE_RTOS_TI_CC3220SF
Platform.AMAZON_FREE_RTOS_DEFAULT
```

## Signing Profile

A signing profile is a code-signing template that can be used to pre-define the signature specifications for a signing job.
A signing profile includes a signing platform to designate the file type to be signed, the signature format, and the signature algorithms.
For more information, visit [Signing Profiles in AWS Signer](https://docs.aws.amazon.com/signer/latest/developerguide/gs-profile.html).

The following code sets up a signing profile for signing lambda code bundles -

```ts
import * as signer from '@aws-cdk/aws-signer';

const signingProfile = new signer.SigningProfile(this, 'SigningProfile', { 
  platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
} );
```

A signing profile is valid by default for 135 months. This can be modified by specifying the `signatureValidityPeriod` property.
