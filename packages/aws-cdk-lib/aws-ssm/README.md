# AWS Systems Manager Construct Library

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Using existing SSM Parameters in your CDK app

You can reference existing SSM Parameter Store values that you want to use in
your CDK app by using `ssm.StringParameter.fromStringParameterAttributes`:

```ts
const parameterVersion = Token.asNumber({ Ref: 'MyParameter' });

// Retrieve the latest value of the non-secret parameter
// with name "/My/String/Parameter".
const stringValue = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValue', {
  parameterName: '/My/Public/Parameter',
  // 'version' can be specified but is optional.
}).stringValue;
const stringValueVersionFromToken = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValueVersionFromToken', {
  parameterName: '/My/Public/Parameter',
  // parameter version from token
  version: parameterVersion,
}).stringValue;

// Retrieve a specific version of the secret (SecureString) parameter.
// 'version' is always required.
const secretValue = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValue', {
  parameterName: '/My/Secret/Parameter',
  version: 5,
});
const secretValueVersionFromToken = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersionFromToken', {
  parameterName: '/My/Secret/Parameter',
  // parameter version from token
  version: parameterVersion,
});
```

You can also reference an existing SSM Parameter Store value that matches an
[AWS specific parameter type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-specific-parameter-types):

```ts
ssm.StringParameter.valueForTypedStringParameterV2(this, '/My/Public/Parameter', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
```

To do the same for a SSM Parameter Store value that is stored as a list:

```ts
ssm.StringListParameter.valueForTypedListParameter(this, '/My/Public/Parameter', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
```

### Lookup existing parameters

You can also use an existing parameter by looking up the parameter from the AWS environment.
This method uses AWS API calls to lookup the value from SSM during synthesis.

```ts
const stringValue = ssm.StringParameter.valueFromLookup(this, '/My/Public/Parameter');
```

The result of the `StringParameter.valueFromLookup()` operation will be written to a file
called `cdk.context.json`. You must commit this file to source control so
that the lookup values are available in non-privileged environments such
as CI build steps, and to ensure your template builds are repeatable.

To customize the cache key, use the `additionalCacheKey` property of the `options` parameter.
This allows you to have multiple lookups with the same parameters
cache their values separately. This can be useful if you want to
scope the context variable to a construct (ie, using `additionalCacheKey: this.node.path`),
so that if the value in the cache needs to be updated, it does not need to be updated
for all constructs at the same time.

```ts
const stringValue = ssm.StringParameter.valueFromLookup(this, '/My/Public/Parameter', undefined, { additionalCacheKey: this.node.path });
```

When using `valueFromLookup` an initial value of 'dummy-value-for-${parameterName}'
(`dummy-value-for-/My/Public/Parameter` in the above example)
is returned prior to the lookup being performed. This can lead to errors if you are using this
value in places that require a certain format. For example if you have stored the ARN for a SNS
topic in a SSM Parameter which you want to lookup and provide to `Topic.fromTopicArn()`

```ts
const arnLookup = ssm.StringParameter.valueFromLookup(this, '/my/topic/arn');
sns.Topic.fromTopicArn(this, 'Topic', arnLookup);
```

Initially `arnLookup` will be equal to `dummy-value-for-/my/topic/arn` which will cause
`Topic.fromTopicArn` to throw an error indicating that the value is not in `arn` format.

For these use cases you need to handle the `dummy-value` in your code. For example:

```ts
const arnLookup = ssm.StringParameter.valueFromLookup(this, '/my/topic/arn');
let arnLookupValue: string;
if (arnLookup.includes('dummy-value')) {
	arnLookupValue = this.formatArn({
	service: 'sns',
	resource: 'topic',
	resourceName: arnLookup,
	});

} else {
	arnLookupValue = arnLookup;
}

sns.Topic.fromTopicArn(this, 'Topic', arnLookupValue);
```

Alternatively, if the property supports tokens you can convert the parameter value into a token
to be resolved _after_ the lookup has been completed.

```ts
const arnLookup = ssm.StringParameter.valueFromLookup(this, '/my/role/arn');
iam.Role.fromRoleArn(this, 'role', Lazy.string({ produce: () => arnLookup }));
```

### cross-account SSM Parameters sharing

AWS Systems Manager (SSM) Parameter Store supports cross-account sharing of parameters using the AWS Resource Access Manager (AWS RAM)
service. In a multi-account environment, this feature enables accounts (referred to as "consuming accounts") to access and retrieve
parameter values that are shared by other accounts (referred to as "sharing accounts"). To reference and use a shared SSM parameter
in a consuming account, the `fromStringParameterArn()` method can be employed.

The `fromStringParameterArn()` method provides a way for consuming accounts to create an instance of the StringParameter
class from the Amazon Resource Name (ARN) of a shared SSM parameter. This allows the consuming account to retrieve and utilize the
parameter value, even though the parameter itself is owned and managed by a different sharing account.

```ts
const sharingParameterArn = 'arn:aws:ssm:us-east-1:1234567890:parameter/dummyName';
const sharedParam = ssm.StringParameter.fromStringParameterArn(this, 'SharedParam', sharingParameterArn);
// the value can be accessed via sharedParam.stringValue
```

Things to note:

- The account that owns the AWS Systems Manager (SSM) parameter and wants to share it with other accounts (referred to as the "sharing account") must create the parameter in the advanced tier. This is a prerequisite for sharing SSM parameters across accounts.

- After creating the parameter in the advanced tier, the sharing account needs to set up a resource share using AWS Resource Access Manager (RAM). This resource share will specify the SSM parameter(s) to be shared and the accounts (referred to as "consuming accounts") with which the parameter(s) should be shared.

- Once the resource share is created by the sharing account, the consuming account(s) will receive an invitation to join the resource share. For the consuming account(s) to access and use the shared SSM parameter(s), they must accept the resource share invitation from the sharing account.

- The AWS Systems Manager Parameter Store parameter being referenced must be located in the same AWS region as the AWS CDK stack that is consuming or using the parameter.

In summary, the process involves three main steps:

1. The sharing account creates the SSM parameter(s) in the advanced tier.

2. The sharing account creates a resource share using AWS RAM, specifying the SSM parameter(s) and the consuming account(s).

3. The consuming account(s) accept the resource share invitation to gain access to the shared SSM parameter(s).

This cross-account sharing mechanism allows for centralized management and distribution of configuration data (stored as SSM parameters) across multiple AWS accounts within an organization or between different organizations.

Read [Working with shared parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-shared-parameters.html) for more details.

## Creating new SSM Parameters in your CDK app

You can create either `ssm.StringParameter` or `ssm.StringListParameter`s in
a CDK app. These are public (not secret) values. Parameters of type
*SecureString* cannot be created directly from a CDK application; if you want
to provision secrets automatically, use Secrets Manager Secrets (see the
`aws-cdk-lib/aws-secretsmanager` package).

```ts
new ssm.StringParameter(this, 'Parameter', {
  allowedPattern: '.*',
  description: 'The value Foo',
  parameterName: 'FooParameter',
  stringValue: 'Foo',
  tier: ssm.ParameterTier.ADVANCED,
});
```

```ts
// Create a new SSM Parameter holding a String
const param = new ssm.StringParameter(this, 'StringParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringValue: 'Initial parameter value',
  // allowedPattern: '.*',
});

// Grant read access to some Role
declare const role: iam.IRole;
param.grantRead(role);

// Create a new SSM Parameter holding a StringList
const listParameter = new ssm.StringListParameter(this, 'StringListParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringListValue: ['Initial parameter value A', 'Initial parameter value B'],
  // allowedPattern: '.*',
});
```

When specifying an `allowedPattern`, the values provided as string literals
are validated against the pattern and an exception is raised if a value
provided does not comply.

## Using Tokens in parameter name

When using [CDK Tokens](https://docs.aws.amazon.com/cdk/v2/guide/tokens.html) in parameter name,
you need to explicitly set the `simpleName` property. Setting `simpleName` to an incorrect boolean
value may result in unexpected behaviours, such as having duplicate '/' in the parameter ARN
or missing a '/' in the parameter ARN.

`simpleName` is used to indicates whether the parameter name is a simple name. A parameter name
without any '/' is considered a simple name, thus you should set `simpleName` to `true`.
If the parameter name includes '/', set `simpleName` to `false`.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const simpleParameter = new ssm.StringParameter(this, 'StringParameter', {
  // the parameter name doesn't contain any '/'
  parameterName: 'parameter',
  stringValue: 'SOME_VALUE',
  simpleName: true, // set `simpleName` to true
});

declare const func: lambda.IFunction;
const nonSimpleParameter = new ssm.StringParameter(this, 'StringParameter', {
  // the parameter name contains '/'
  parameterName: `/${func.functionName}/my/app/param`,
  stringValue: 'SOME_VALUE',
  simpleName: false, // set `simpleName` to false
});
```
