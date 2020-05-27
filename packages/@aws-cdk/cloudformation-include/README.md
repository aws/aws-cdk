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

Assume we have a file `my-template.json`, that contains the following CloudFormation template:

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

It can be included in a CDK application with the following code:

```typescript
import * as cfn_inc from '@aws-cdk/cloudformation-include';

const cfnTemplate = new cfn_inc.CfnInclude(this, 'Template', {
  templateFile: 'my-template.json',
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

## Known limitations

This module is still in its early, experimental stage,
and so does not implement all features of CloudFormation templates.
All items unchecked below are currently not supported.

### Ability to retrieve CloudFormation objects from the template:

- [x] Resources
- [ ] Parameters
- [ ] Conditions
- [ ] Outputs

### [Resource attributes](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html):

- [x] Properties
- [ ] Condition
- [x] DependsOn
- [ ] CreationPolicy
- [ ] UpdatePolicy
- [x] UpdateReplacePolicy
- [x] DeletionPolicy
- [x] Metadata

### [CloudFormation functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html):

- [x] Ref
- [x] Fn::GetAtt
- [x] Fn::Join
- [x] Fn::If
- [ ] Fn::And
- [ ] Fn::Equals
- [ ] Fn::Not
- [ ] Fn::Or
- [ ] Fn::Base64
- [ ] Fn::Cidr
- [ ] Fn::FindInMap
- [ ] Fn::GetAZs
- [ ] Fn::ImportValue
- [ ] Fn::Select
- [ ] Fn::Split
- [ ] Fn::Sub
- [ ] Fn::Transform
