# AWS Systems Manager Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Using existing SSM Parameters in your CDK app

You can reference existing SSM Parameter Store values that you want to use in
your CDK app by using `ssm.StringParameter.fromStringParameterAttributes`:

```ts
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
ssm.StringParameter.valueForTypedStringParameterV2(stack, '/My/Public/Parameter', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
```

To do the same for a SSM Parameter Store value that is stored as a list:

```ts
ssm.StringListParameter.valueForTypedListParameter(stack, '/My/Public/Parameter', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
```

### Lookup existing parameters

You can also use an existing parameter by looking up the parameter from the AWS environment.
This method uses AWS API calls to lookup the value from SSM during synthesis.

```ts
const stringValue = ssm.StringParameter.valueFromLookup(stack, '/My/Public/Parameter');
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

## Creating new SSM Parameters in your CDK app

You can create either `ssm.StringParameter` or `ssm.StringListParameter`s in
a CDK app. These are public (not secret) values. Parameters of type
*SecureString* cannot be created directly from a CDK application; if you want
to provision secrets automatically, use Secrets Manager Secrets (see the
`@aws-cdk/aws-secretsmanager` package).

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
const param = new ssm.StringParameter(stack, 'StringParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringValue: 'Initial parameter value',
  // allowedPattern: '.*',
});

// Grant read access to some Role
param.grantRead(role);

// Create a new SSM Parameter holding a StringList
const listParameter = new ssm.StringListParameter(stack, 'StringListParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringListValue: ['Initial parameter value A', 'Initial parameter value B'],
  // allowedPattern: '.*',
});
```

When specifying an `allowedPattern`, the values provided as string literals
are validated against the pattern and an exception is raised if a value
provided does not comply.

