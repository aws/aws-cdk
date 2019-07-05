## AWS Cloud Development Kit Core Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**

---
<!--END STABILITY BANNER-->

This library includes the basic building blocks of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk)
(AWS CDK).

## Aspects

Aspects are a mechanism to extend the CDK without having to directly impact the
class hierarchy. We have implemented aspects using the [Visitor
Pattern](https://en.wikipedia.org/wiki/Visitor_pattern).

An aspect in the CDK is defined by this [interface](lib/aspect.ts)

Aspects can be applied to any construct. During the tree
"prepare" phase the aspect will visit each construct in the tree once.
Aspects are invoked in the order they were added to the construct. They
traverse the construct tree in a breadth first order starting at the `App`
ending at the leaf nodes (most commonly the CloudFormation Resource). Aspect
authors implement the `visit(IConstruct)` function and can inspect the
`Construct` for specific characteristics. Such as, is this construct a
CloudFormation Resource?

## Tagging

Tags are implemented using aspects.

Tags can be applied to any construct. Tags are inherited, based on the scope. If
you tag construct A, and A contains construct B, construct B inherits the tag.
The Tag API supports:

 * `Tag` add (apply) a tag, either to specific resources or all but specific resources
 * `RemoveTag` remove a tag, again either from specific resources or all but specific resources

A simple example, if you create a stack and want anything in the stack to receive a
tag:

```ts
import cdk = require('@aws-cdk/core');

const app = new cdk.App();
const theBestStack = new cdk.Stack(app, 'MarketingSystem');
theBestStack.node.apply(new cdk.Tag('StackType', 'TheBest'));

// any resources added that support tags will get them
```

> The goal was to enable the ability to define tags in one place and have them
> applied consistently for all resources that support tagging. In addition
> the developer should not have to know if the resource supports tags. The
> developer defines the tagging intents for all resources within a path.
> If the resources support tags they are added, else no action is taken.

### Tag Example with ECS

We are going to use the [ECS example](https://awslabs.github.io/aws-cdk/ecs_example.html) as starting point.

For the purposes of example, this ECS cluster is for the Marketing Department.
Marketing has two core groups Business to Business (B2B) and Business to Consumer
(B2C). However, the Marketing team relies on the Platform team to help build the
common components across businesses and separates costs to match. The goal here
is tag the Platform team resources, the Marketing Department and then Marketing
groups to enable proper cost allocations.

We have modified the example and the code is located:
examples/cdk-examples-typescript/hello-cdk-ecs-tags

When the example is run the following tags are created:

> We are omitting the default tags for VPC components.

| Construct Path | Tag Key | Tag Value |
| ----------|:---------|:-----|
|MarketingSystem/MarketingVpc|CostCenter|Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet1/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet2/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PublicSubnet3/NATGateway| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet1| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet1/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet2| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet2/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet3| CostCenter | Platform|
|MarketingSystem/MarketingVpc/PrivateSubnet3/RouteTable| CostCenter | Platform|
|MarketingSystem/MarketingVpc/IGW|CostCenter|Platform|
|MarketingSystem/B2BService/Service/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2BService/LB/PublicListener/ECSGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/Service/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/SecurityGroup/Resource|CostCenter|Marketing|
|MarketingSystem/B2CService/LB/PublicListener/ECSGroup/Resource|CostCenter|Marketing|

As you can see many tags are generated with only a few intent based directives. The CDK does default some additional tags for suggested `Name` keys. If you want to remove those tags you can do so by using the `RemoveTag` aspect, see below:

```ts
// snip //
const vpc = new ec2.Vpc(marketingStack, 'MarketingVpc', {
  maxAZs: 3 // Default is all AZs in region
  });
// override the VPC tags with Platform
// this will tag the VPC, Subnets, Route Tables, IGW, and NatGWs
vpc.node.apply(new cdk.Tag(COST_CENTER_KEY, 'Platform'));
vpc.node.apply(new cdk.RemoveTag('Name'));
// snip //
```

This will remove the name tags from the VPC, subnets, route tables and NAT
gateways. If you've been following closely, this may lead you to ask how does
remove work when the tag is actually applied closer to the resource? The Tag API
has a few features that are covered later to explain how this works.

### API

In order to enable additional controls a Tag can specifically include or
exclude a CloudFormation Resource Type, propagate tags for an autoscaling group,
and use priority to override the default precedence. See the `TagProps`
interface for more details.

Tags can be configured by using the properties for the AWS CloudFormation layer
resources or by using the tag aspects described here. The aspects will always
take precedence over the AWS CloudFormation layer in the event of a name
collision. The tags will be merged otherwise. For the aspect based tags, the
tags applied closest to the resource will take precedence, given an equal
priority. A higher priority tag will always take precedence over a lower
priority tag.

#### applyToLaunchedInstances

This property is a boolean that defaults to `true`. When `true` and the aspect
visits an AutoScalingGroup resource the `PropagateAtLaunch` property is set to
true. If false the property is set accordingly.

```ts
// ... snip
const vpc = new ec2.Vpc(this, 'MyVpc', { ... });
vpc.node.apply(new cdk.Tag('MyKey', 'MyValue', { applyToLaunchedInstances: false }));
// ... snip
```

#### includeResourceTypes

Include is an array property that contains strings of CloudFormation Resource
Types. As the aspect visits nodes it only takes action if node is one of the
resource types in the array. By default the array is empty and an empty array is
interpreted as apply to any resource type.

```ts
// ... snip
const vpc = new ec2.Vpc(this, 'MyVpc', { ... });
vpc.node.apply(new cdk.Tag('MyKey', 'MyValue', { includeResourceTypes: ['AWS::EC2::Subnet']}));
// ... snip
```

#### excludeResourceTypes

Exclude is the inverse of include. Exclude is also an array of CloudFormation
Resource Types. As the aspect visit nodes it will not take action if the node is
one of the resource types in the array. By default the array is empty and an
empty array is interpreted to match no resource type. Exclude takes precedence
over include in the event of a collision.

```ts
// ... snip
const vpc = new ec2.Vpc(this, 'MyVpc', { ... });
vpc.node.apply(new cdk.Tag('MyKey', 'MyValue', { exludeResourceTypes: ['AWS::EC2::Subnet']}));
// ... snip
```

#### priority

Priority is used to control precedence when the default pattern does not work.
In general users should try to avoid using priority, but in some situations it
is required. In the example above, this is how `RemoveTag` works. The default
setting for removing tags uses a higher priority than the standard tag.

```ts
// ... snip
const vpc = new ec2.Vpc(this, 'MyVpc', { ... });
vpc.node.apply(new cdk.Tag('MyKey', 'MyValue', { priority: 2 }));
// ... snip
```

## Secrets

To help avoid accidental storage of secrets as plain text we use the `SecretValue` type to
represent secrets.

The best practice is to store secrets in AWS Secrets Manager and reference them using `SecretValue.secretsManager`:

```ts
const secret = SecretValue.secretsManager('secretId', {
  jsonField: 'password' // optional: key of a JSON field to retrieve (defaults to all content),
  versionId: 'id'       // optional: id of the version (default AWSCURRENT)
  versionStage: 'stage' // optional: version stage name (default AWSCURRENT)
});
```

Using AWS Secrets Manager is the recommended way to reference secrets in a CDK app.
However, `SecretValue` supports the following additional options:

 * `SecretValue.plainText(secret)`: stores the secret as plain text in your app and the resulting template (not recommended).
 * `SecretValue.ssmSecure(param, version)`: refers to a secret stored as a SecureString in the SSM Parameter Store.
 * `SecretValue.cfnParameter(param)`: refers to a secret passed through a CloudFormation parameter (must have `NoEcho: true`).
 * `SecretValue.cfnDynamicReference(dynref)`: refers to a secret described by a CloudFormation dynamic reference (used by `ssmSecure` and `secretsManager`).

## AWS CloudFormation features

A CDK stack synthesizes to AWS CloudFormation templates. This section explains
how this module allows users to access low-level CloudFormation features when
needed.

### Template Parameters

CloudFormation templates support the use of [Parameters][cfn-parameters] to
customize a template. They enable CloudFormation users to input custom values to
a template each time a stack is created or updated. While the CDK design
philosophy favors using build-time parameterization, users may need to use
CloudFormation in a number of cases (for example, when migrating an existing
stack to the AWS CDK).

Template parameters can be added to a stack by using the `CfnParameter` class:

```ts
// "this" is the current Construct scope
new CfnParameter(this, 'MyParameter');

// - or -
new CfnParameter(this, 'MyParameter', {
  type: 'Number',
  default: 1337,
  // See the API reference for more configuration props
});
```

The value of parameters can then be obtained using one of the `value` methods.
As parameters are only resolved at deployment time, the values obtained are
placeholder tokens for the real value (`Token.isUnresolved` would return `true`
for those):

```ts
const param = new CfnParameter(this, 'ParameterName', { /* config */ });

// If the parameter is a String
param.valueAsString;

// If the parameter is a Number
param.valueAsNumber;

// If the parameter is a List
param.valueAsList;
```

[cfn-parameters]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html

### Pseudo Parameters

CloudFomration supports a number of [pseudo parameters][cfn-pseudo-params],
which resolve to useful values at deployment time. CloudFormation pseudo
parameters can be obtained from static members of the `Aws` class.

It is generally recommended to access pseudo parameters from the scope's `stack`
instead, which guarantees the values produced are qualifying the designated
stack, which is essential in cases where resources are shared cross-stack:

```ts
// "this" is the current construct
const stack = Stack.of(this);

stack.account; // Returns the AWS::AccountId for this stack (or the literal value if known)
stack.region;  // Returns the AWS::Region for this stack (or the literal value if known)
stack.partition;
```

[cfn-pseudo-params]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html

### Intrinsic Functions and Condition Expressions

CloudFormation supports [intrinsic functions][cfn-intrinsics]. These functions
can be accessed from the `Fn` class, which provides type-safe methods for each
intrinsic function as well as condition expressions:

```ts
// To use Fn::Base64
Fn.base64('SGVsbG8gQ0RLIQo=');

// To compose condition expressions:
const environmentParameter = new CfnParameter(this, 'Environment');
Fn.conditionAnd(
  // The "Environment" CloudFormation template parameter evaluates to "Production"
  Fn.conditionEquals('Production', environmentParameter),
  // The AWS::Region pseudo-parameter value is NOT equal to "us-east-1"
  Fn.conditionNot(Fn.conditionEquals('us-east-1', Aws.REGION)),
);
```

When working with deploy-time values (those for which `Token.isUnresolved`
returns `true`), idiomatic conditionals from the programming language cannot be
used (the value will not be known until deployment time). When conditional logic
needs to be expressed with un-resolved values, it is necessary to use
CloudFormation conditions, thanks to the `CfnCondition` class:

```ts
const environmentParameter = new CfnParameter(this, 'Environment');
const isProd = new CfnCondition(this, 'IsProduction', {
  expression: Fn.conditionEquals('Production', environmentParameter),
});

// Configuration value that is different based on IsProduction
Fn.conditionIf(isProd.logicalId, '1337', 'YOLO').toString();

// Make a CfnResource creation conditional to IsProduction
const resource = new CfnResource(this, 'RawResource', { /* ... */ });
resource.cfnOptions.condition = isProd;
```

[cfn-intrinsics]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html

### Mappings

CloudFormation [mappings][cfn-mappings] are created and queried using the
`CfnMappings` class:

```ts
const mapping = new CfnMapping(this, 'MappingTable', {
  mapping: {
    regionName: {
      'us-east-1': 'US East (N. Virginia)',
      'us-east-2': 'US East (Ohio)',
      // ...
    },
    // ...
  }
});

mapping.findInMap('regionName', Aws.REGION);
```

[cfn-mappings]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html

### Dynamic References

CloudFormation supports [dynamically resolving][cfn-dynamic-references] values
for SSM parameters (including secure strings) and Secrets Manager. Encoding such
references is done using the `CfnDynamicReference` class:

```ts
new CfnDynamicReference(this, 'SecureStringValue', {
  service: CfnDynamicReferenceService.SECRETS_MANAGER,
  referenceKey: 'secret-id:secret-string:json-key:version-stage:version-id',
});
```

[cfn-dynamic-references]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html

### Stack Outputs

CloudFormation [stack outputs][cfn-stack-output] and exports are created using
the `CfnOutput` class:

```ts
new CfnOutput(this, 'OutputName', {
  value: bucket.bucketName,
  description: 'The name of an S3 bucket', // Optional
  exportName: 'Global.BucketName', // Registers a CloudFormation export
});
```

[cfn-stack-output]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html

### Template Options & Transform

CloudFormation templates support a number of options, including which Macros or
[Transforms][cfn-transform] to use when deploying the stack. Those can be
configured using the `stack.templateOptions` property:

```ts
const stack = new Stack(app, 'StackName');

stack.templateOptions.description = 'This will appear in the AWS console';
stack.templateOptions.transform = 'AWS::Serverless';
stack.templateOptions.metadata = {
  metadataKey: 'MetadataValue',
};
```

[cfn-transform]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html

### Resource Options

Similar to template options, CloudFormation resources can also specify
[resource attributes][cfn-resource-attributes]. The `CfnResource` class allows
accessing those though the `cfnOptions` property:

```ts
const rawBucket = new s3.CfnBucket(this, 'Bucket', { /* ... */ });
rawBucket.condition = new CfnCondition(this, 'EnableBucket', { /* ... */ });
rawBucket.cfnOptions.metadata = {
  metadataKey: 'MetadataValue',
};
```

Resource dependencies (the `DependsOn` attribute) is modified using the
`cfnResource.addDependsOn` method:

```ts
const resourceA = new CfnResource(this, 'ResourceA', { /* ... */ });
const resourceB = new CfnResource(this, 'ResourceB', { /* ... */ });

resourceB.addDependsOn(resourceA);
```

[cfn-resource-attributes]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html

### Emitting Raw Resources

The `CfnResource` class allows emitting arbitrary entries in the
[Resources][cfn-resources] section of the CloudFormation template.

```ts
new CfnResource(this, 'ResourceId', {
  type: 'AWS::S3::Bucket',
  properties: {
    BucketName: 'bucket-name'
  },
});
```

As for any other resource, the logical ID in the CloudFormation template will be
generated by the AWS CDK, but the type and properties will be copied verbatim in
the synthesized template.

### Including raw CloudFormation template fragments

When migrating a CloudFormation stack to the AWS CDK, it can be useful to
include fragments of an existing template verbatim in the synthesized template.
This can be achieved using the `CfnInclude` class.

```ts
new CfnInclude(this, 'ID', {
  template: {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'my-shiny-bucket'
        }
      }
    }
  },
});
```
