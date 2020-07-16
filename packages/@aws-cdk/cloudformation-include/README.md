# Include CloudFormation templates in the CDK

<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This module contains a set of classes whose goal is to facilitate working
with existing CloudFormation templates in the CDK.
It can be thought of as an extension of the capabilities of the
[`CfnInclude` class](../@aws-cdk/core/lib/cfn-include.ts).

## Basic usage

Assume we have a file with an existing template. It could be in JSON format, in a file `my-template.json`:

```json
{
  "Resources": {
    "Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": "some-bucket-name"
      }
    }
  }
}
```

Or it could by in YAML format, in a file `my-template.yaml`:

```yaml
Resources:
  Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: some-bucket-name
```

It can be included in a CDK application with the following code:

```typescript
import * as cfn_inc from '@aws-cdk/cloudformation-include';

const cfnTemplate = new cfn_inc.CfnInclude(this, 'Template', {
  templateFile: 'my-template.json',
});
```

Or, if our template is YAML, we can use

```typescript
const cfnTemplate = new cfn_inc.CfnInclude(this, 'Template', {
  templateFile: 'my-template.yaml',
});
```

This will add all resources from `my-template.json` into the CDK application,
preserving their original logical IDs from the template file.

Any resource from the included template can be retrieved by referring to it by its logical ID from the template.
If you know the class of the CDK object that corresponds to that resource,
you can cast the returned object to the correct type:

```typescript
import * as s3 from '@aws-cdk/aws-s3';

const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;
// cfnBucket is of type s3.CfnBucket
```

Any modifications made to that resource will be reflected in the resulting CDK template;
for example, the name of the bucket can be changed:

```typescript
cfnBucket.bucketName = 'my-bucket-name';
```

You can also refer to the resource when defining other constructs,
including the higher-level ones
(those whose name does not start with `Cfn`),
for example:

```typescript
import * as iam from '@aws-cdk/aws-iam';

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.AnyPrincipal(),
});
role.addToPolicy(new iam.PolicyStatement({
  actions: ['s3:*'],
  resources: [cfnBucket.attrArn],
}));
```

If you need, you can also convert the CloudFormation resource to a higher-level
resource by importing it by its name:

```typescript
const bucket = s3.Bucket.fromBucketName(this, 'L2Bucket', cfnBucket.ref);
// bucket is of type s3.IBucket
```

## Conditions

If your template uses [CloudFormation Conditions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html),
you can retrieve them from your template:

```typescript
import * as core from '@aws-cdk/core';

const condition: core.CfnCondition = cfnTemplate.getCondition('MyCondition');
```

The `CfnCondition` object is mutable,
and any changes you make to it will be reflected in the resulting template:

```typescript
condition.expression = core.Fn.conditionEquals(1, 2);
```

## Outputs

If your template uses [CloudFormation Outputs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html),
you can retrieve them from your template:

```typescript
import * as core from '@aws-cdk/core';

const output: core.CfnOutput = cfnTemplate.getOutput('MyOutput');
```

The `CfnOutput` object is mutable,
and any changes you make to it will be reflected in the resulting template:

```typescript
output.value = cfnBucket.attrArn;
```

## Nested Stacks

This module also support templates that use [nested stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html).

For example, if you have the following parent template:

```json
{
  "Resources": {
    "ChildStack": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://my-s3-template-source.s3.amazonaws.com/child-import-stack.json",
        "Parameters": {
          "MyBucketParameter": "my-bucket-name"
        }
      }
    }
  }
}
```

where the child template pointed to by `https://my-s3-template-source.s3.amazonaws.com/child-import-stack.json` is:

```json
{
  "Parameters": {
    "MyBucketParameter": {
      "Type": "String",
      "Default": "default-bucket-param-name"
    }
  },
  "Resources": {
    "BucketImport": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": {
          "Ref": "MyBucketParameter"
        }
      }
    }
  }
}
```

You can include both the parent stack and the nested stack in your CDK Application as follows:

```typescript
const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
  templateFile: 'path/to/my-parent-template.json',
  nestedStacks: {
    'ChildStack': {
      templateFile: 'path/to/my-nested-template.json',
    },
  },
});
```

Now you can access the ChildStack nested stack and included template with:

```typescript
const includedChildStack = parentTemplate.getNestedStack('ChildStack');
const childStack: core.NestedStack = includedChildStack.stack;
const childStackTemplate: cfn_inc.CfnInclude = includedChildStack.includedTemplate;
```

Now you can reference resources from `ChildStack` and modify them like any other included template:

```typescript
const bucket = childStackTemplate.getResource('MyBucket') as s3.CfnBucket;
bucket.bucketName = 'my-new-bucket-name';

const bucketReadRole = new iam.Role(childStack, 'MyRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

bucketReadRole.addToPolicy(new iam.PolicyStatement({
  actions: [
    's3:GetObject*',
    's3:GetBucket*',
    's3:List*',
  ],
  resources: [bucket.attrArn],
}));
```

## Known limitations

This module is still in its early, experimental stage,
and so does not implement all features of CloudFormation templates.
All items unchecked below are currently not supported.

### Ability to retrieve CloudFormation objects from the template:

- [x] Resources
- [x] Parameters
- [x] Conditions
- [x] Outputs

### [Resource attributes](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html):

- [x] Properties
- [x] Condition
- [x] DependsOn
- [x] CreationPolicy
- [x] UpdatePolicy
- [x] UpdateReplacePolicy
- [x] DeletionPolicy
- [x] Metadata

### [CloudFormation functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html):

- [x] Ref
- [x] Fn::GetAtt
- [x] Fn::Join
- [x] Fn::If
- [x] Fn::And
- [x] Fn::Equals
- [x] Fn::Not
- [x] Fn::Or
- [x] Fn::Base64
- [x] Fn::Cidr
- [x] Fn::FindInMap
- [x] Fn::GetAZs
- [x] Fn::ImportValue
- [x] Fn::Select
- [x] Fn::Split
- [ ] Fn::Sub
- [x] Fn::Transform
