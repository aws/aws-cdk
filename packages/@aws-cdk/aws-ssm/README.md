## The CDK Construct Library for AWS Systems Manager
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

### Creating SSM Parameters
You can use either the `ssm.StringParameter` or `ssm.StringListParameter` (AWS CloudFormation does not support creating
*Secret-String* SSM parameters, as those would require the secret value to be inlined in the template document) classes
to register new SSM Parameters into your application:

[creating SSM parameters](test/integ.parameter.lit.ts)

When specifying an `allowedPattern`, the values provided as string literals are validated against the pattern and an
exception is raised if a value provided does not comply.
