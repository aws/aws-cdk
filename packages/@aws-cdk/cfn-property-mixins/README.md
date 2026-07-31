# CDK CloudFormation Property Mixins
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

Auto-generated, type-safe CDK Mixins for every CloudFormation resource property.
These allow you to apply L1 properties to any construct (L1, L2, or custom) using the Mixins mechanism from `aws-cdk-lib`.

## Usage

For every CloudFormation resource, this package provides a `CfnXxxPropsMixin` class.
Apply it using `.with()` or `Mixins.of()`:

```typescript
new s3.Bucket(scope, "MyBucket")
  .with(new CfnBucketPropsMixin({
    versioningConfiguration: { status: "Enabled" },
    publicAccessBlockConfiguration: {
      blockPublicAcls: true,
      blockPublicPolicy: true,
    },
  }));
```

### Cross-Service References

Deeply nested properties support cross-service references:

```typescript
const myKey = new kms.Key(scope, "MyKey");

new s3.Bucket(scope, "EncryptedBucket")
  .with(new CfnBucketPropsMixin({
    bucketEncryption: {
      serverSideEncryptionConfiguration: [{
        serverSideEncryptionByDefault: {
          sseAlgorithm: "aws:kms",
          kmsMasterKeyId: myKey,
        },
      }],
    },
  }));
```

### Merge Strategies

When a mixin is applied, its properties are merged onto the target resource using a merge strategy.
The strategy controls what happens when both the mixin and the existing resource define the same property.

There are two built-in strategies:

#### `PropertyMergeStrategy.combine()` (default)

Deep merges nested objects from the mixin into the target.
When both the existing and new value for a property are plain objects, their keys are merged recursively — existing keys are preserved and new keys are added.
Primitives, arrays, and mismatched types are replaced by the mixin value.

This is useful when you want to add configuration without losing what's already set:

```typescript
const combineBucket = new s3.CfnBucket(scope, "CombineBucket");
combineBucket.publicAccessBlockConfiguration = { blockPublicAcls: true };

// Adds blockPublicPolicy while preserving the existing blockPublicAcls
combineBucket.with(new CfnBucketPropsMixin({
  publicAccessBlockConfiguration: { blockPublicPolicy: true },
}));
// Result: { blockPublicAcls: true, blockPublicPolicy: true }
```

#### `PropertyMergeStrategy.override()`

Replaces existing property values with the mixin values.
Each property is copied as-is without inspecting nested objects.
Any previous value on the target is discarded.

This is useful when you want to fully replace a configuration:

```typescript
const overrideBucket = new s3.CfnBucket(scope, "OverrideBucket");
overrideBucket.publicAccessBlockConfiguration = { blockPublicAcls: true };

// Replaces the entire publicAccessBlockConfiguration
overrideBucket.with(new CfnBucketPropsMixin(
  { publicAccessBlockConfiguration: { blockPublicPolicy: true } },
  { strategy: PropertyMergeStrategy.override() },
));
// Result: { blockPublicPolicy: true } — blockPublicAcls is gone
```

#### Custom Strategies

You can implement `IMergeStrategy` to define your own merge behavior.
The `apply` method receives the target object, source object, and an allowlist of property keys:

```typescript
class ArrayAppendStrategy implements IMergeStrategy {
  public apply(target: any, source: any, allowedKeys: string[]) {
    for (const key of allowedKeys) {
      if (key in source) {
        if (Array.isArray(target[key])) {
          // append to target
          target[key] = target[key].concat(source[key]);
        } else {
          // override
          target[key] = source[key];
        }
      }
    }
  }
}
```

### Deferred Values (Boxes)

Property mixins support **Box-backed values**. Most L2 constructs in `aws-cdk-lib` use Boxes internally to defer property computation until synthesis time. When a mixin encounters a Box on the target, the merge is automatically deferred — the merge strategy runs once the Box resolves, ensuring it operates on final values.

This means mixins work correctly with L2 constructs that use Boxes for properties like `replicas`, `rules`, or `tags`, without any special handling from the user:

```typescript
// TableV2 uses a Box internally for replicas.
// The mixin defers the merge and appends the new replica at synthesis time.
const table = new dynamodb.TableV2(scope, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  // L2 prop: pointInTimeRecovery is a boolean
  replicas: [{ region: 'us-east-1', pointInTimeRecovery: true }],
});

// Mixins always use L1 (CloudFormation) property names and shapes,
// regardless of what the L2 API looks like.
table.with(new CfnGlobalTablePropsMixin({
  replicas: [{
    region: 'eu-west-1',
    // L1 prop: pointInTimeRecoverySpecification is an object
    pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
  }],
}, { strategy: PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() }) }));

// Result (synthesized CloudFormation):
// Replicas:
//   - Region: us-east-1
//     PointInTimeRecoverySpecification:
//       PointInTimeRecoveryEnabled: true
//   - Region: us-west-2        <-- primary region, added by L2
//   - Region: eu-west-1        <-- added by mixin
//     PointInTimeRecoverySpecification:
//       PointInTimeRecoveryEnabled: true
```

Most L2 constructs in `aws-cdk-lib` use Boxes or Lazys internally to defer property computation until synthesis time. Property mixins detect these automatically and defer the merge until the value resolves, so the merge strategy always operates on final values — no special handling is needed from the user. The only case where merging cannot be deferred is a raw `Token` that is not backed by a Box. This is very rare in the AWS Construct Library, but may occur in third-party packages. If you encounter a construct where merging doesn't work as expected, please [open an issue](https://github.com/aws/aws-cdk/issues/new?template=bug-report.yml) so we can investigate.

### CloudFormation Property Mixins for Every Service

This package provides auto-generated property mixins for every CloudFormation resource across all AWS services.
Each service has its own submodule that mirrors the `aws-cdk-lib` module structure.
Import the mixin for the resource you want to configure from the corresponding service submodule:

```typescript nofixture
import { CfnBucketPropsMixin } from '@aws-cdk/cfn-property-mixins/aws-s3';
import { CfnFunctionPropsMixin } from '@aws-cdk/cfn-property-mixins/aws-lambda';
import { CfnTablePropsMixin } from '@aws-cdk/cfn-property-mixins/aws-dynamodb';
import { CfnLogGroupPropsMixin } from '@aws-cdk/cfn-property-mixins/aws-logs';
import { CfnDistributionPropsMixin } from '@aws-cdk/cfn-property-mixins/aws-cloudfront';
import { CfnDBInstancePropsMixin } from '@aws-cdk/cfn-property-mixins/aws-rds';
```

The naming convention follows a consistent pattern: for a CloudFormation resource `AWS::S3::Bucket`, the mixin class is `CfnBucketPropsMixin` and lives in the `aws-s3` submodule.
The mixin props interface is named `CfnBucketMixinProps` and all properties are optional, so you only need to specify the ones you want to set.

Property mixins work with any construct that has the target resource as its default child.
This means you can apply them to L1 constructs, L2 constructs, and custom constructs alike:

```typescript
// L1 construct
new s3.CfnBucket(scope, "L1Bucket")
  .with(new CfnBucketPropsMixin({ versioningConfiguration: { status: "Enabled" } }));

// L2 construct — the mixin finds the CfnBucket default child
new s3.Bucket(scope, "L2Bucket")
  .with(new CfnBucketPropsMixin({ versioningConfiguration: { status: "Enabled" } }));
```
