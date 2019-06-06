## AWS Systems Manager Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Installation
Install the module:

```console
$ npm i @aws-cdk/aws-ssm
```

Import it into your code:

```ts
import ssm = require('@aws-cdk/aws-ssm');
```

### Using existing SSM Parameters in your CDK app

You can reference existing SSM Parameter Store values that you want to use in
your CDK app by using `ssm.ParameterStoreString`:

[using SSM parameter](test/integ.parameter-store-string.lit.ts)

### Creating new SSM Parameters in your CDK app

You can create either `ssm.StringParameter` or `ssm.StringListParameter`s in
a CDK app. These are public (not secret) values. Parameters of type
*SecretString* cannot be created directly from a CDK application; if you want
to provision secrets automatically, use Secrets Manager Secrets (see the
`@aws-cdk/aws-secretsmanager` package).

[creating SSM parameters](test/integ.parameter.lit.ts)

When specifying an `allowedPattern`, the values provided as string literals
are validated against the pattern and an exception is raised if a value
provided does not comply.
