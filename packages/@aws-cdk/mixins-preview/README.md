# CDK Mixins (Preview)
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

> **Note**: The core Mixins mechanism (`Mixins`, `Mixin`, `IMixin`, `MixinApplicator`, `ConstructSelector`) is now available in `constructs` and `aws-cdk-lib`.
> All service Mixins are now available in `aws-cdk-lib`.
> Please update your imports.
>
> This package continues to provide **Logs Delivery Mixins** and **EventBridge Event Facades**.

---

CDK Mixins provide a new, advanced way to add functionality through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.
Mixins can be applied during or after construct construction.
Mixins are an _addition_, _not_ a replacement for construct properties.
By itself, they cannot change optionality of properties or change defaults.

## Usage and documentation

See the [documentation for CDK Mixins](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib-readme.html#mixins) in  `aws-cdk-lib`.

### Built-in Mixins

#### S3-Specific Mixins

**AutoDeleteObjects**: Configures automatic object deletion for S3 buckets

```typescript
const myBucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(myBucket).apply(new AutoDeleteObjects());
```

### Logs Delivery

Configures vended logs delivery for supported resources to various destinations:

```typescript
import * as cloudfrontMixins from '@aws-cdk/mixins-preview/aws-cloudfront/mixins';

// Create CloudFront distribution
declare const origin: s3.IBucket;
const distribution = new cloudfront.Distribution(scope, 'Distribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(origin),
  },
});

// Create log destination
const logGroup = new logs.LogGroup(scope, 'DeliveryLogGroup');

// Configure log delivery using the mixin
distribution
  .with(cloudfrontMixins.CfnDistributionLogsMixin.CONNECTION_LOGS.toLogGroup(logGroup, {
    outputFormat: cloudfrontMixins.CfnDistributionConnectionLogsOutputFormat.LogGroup.JSON,
    recordFields: [
      cloudfrontMixins.CfnDistributionConnectionLogsRecordFields.CONNECTIONSTATUS,
      cloudfrontMixins.CfnDistributionConnectionLogsRecordFields.CLIENTIP,
      cloudfrontMixins.CfnDistributionConnectionLogsRecordFields.SERVERIP,
      cloudfrontMixins.CfnDistributionConnectionLogsRecordFields.TLSPROTOCOL,
    ],
  }));
```

Configures vended logs delivery for supported resources when a pre-created destination is provided:

```typescript
import * as cloudfrontMixins from '@aws-cdk/mixins-preview/aws-cloudfront/mixins';

// Create CloudFront distribution
declare const origin: s3.IBucket;
const distribution = new cloudfront.Distribution(scope, 'Distribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(origin),
  },
});

// Create destination bucket
const destBucket = new s3.Bucket(scope, 'DeliveryBucket');
// Add permissions to bucket to facilitate log delivery
const bucketPolicy = new s3.BucketPolicy(scope, 'DeliveryBucketPolicy', {
  bucket: destBucket,
  document: new iam.PolicyDocument(),
});
// Create S3 delivery destination for logs
const destination = new logs.CfnDeliveryDestination(scope, 'Destination', {
  destinationResourceArn: destBucket.bucketArn,
  name: 'unique-destination-name',
  deliveryDestinationType: 'S3',
});

distribution
  .with(cloudfrontMixins.CfnDistributionLogsMixin.CONNECTION_LOGS.toDestination(destination));
```

Vended Logs Configuration for Cross Account delivery (only supported for S3 and Firehose destinations)

```typescript
import * as logDestinations from '@aws-cdk/mixins-preview/aws-logs';
import * as cloudfrontMixins from '@aws-cdk/mixins-preview/aws-cloudfront/mixins';

const destinationAccount = '123456789012';
const sourceAccount = '234567890123';
const region = 'us-east-1';

const app = new App();

const destStack = new Stack(app, 'destination-stack', {
  env: {
    account: destinationAccount,
    region,
  },
});

// Create destination bucket
const destBucket = new s3.Bucket(destStack, 'DeliveryBucket');
new logDestinations.S3DeliveryDestination(destStack, 'Destination', {
  bucket: destBucket,
  sourceAccountId: sourceAccount,
});

const sourceStack = new Stack(app, 'source-stack', {
  env: {
    account: sourceAccount,
    region,
  },
});

// Create CloudFront distribution
declare const origin: s3.IBucket;
const distribution = new cloudfront.Distribution(sourceStack, 'Distribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(origin),
  },
});

const destination = logs.CfnDeliveryDestination.fromDeliveryDestinationArn(sourceStack, 'Destination', `arn of Delivery Destination in destinationAccount`);

distribution
  .with(cloudfrontMixins.CfnDistributionLogsMixin.CONNECTION_LOGS.toDestination(destination));
```

### L1 Property Mixins

For every CloudFormation resource, CDK Mixins automatically generates type-safe property mixins. These allow you to apply L1 properties with full TypeScript support:

```typescript
new s3.Bucket(scope, "Bucket")
  .with(new CfnBucketPropsMixin({
    versioningConfiguration: { status: "Enabled" },
    publicAccessBlockConfiguration: {
      blockPublicAcls: true,
      blockPublicPolicy: true
    }
  }));
```

Deeply nested properties support cross-service references, such as passing a KMS key for encryption:

```typescript
const key = new kms.Key(scope, "Key");

new s3.Bucket(scope, "Bucket")
  .with(new CfnBucketPropsMixin({
    bucketEncryption: {
      serverSideEncryptionConfiguration: [{
        serverSideEncryptionByDefault: {
          sseAlgorithm: "aws:kms",
          kmsMasterKeyId: key,
        },
      }],
    },
  }));
```

Property mixins support two merge strategies:

```typescript
// MERGE (default): Deep merges properties with existing values
Mixins.of(bucket).apply(new CfnBucketPropsMixin(
  { versioningConfiguration: { status: "Enabled" } },
  { strategy: PropertyMergeStrategy.MERGE }
));

// OVERRIDE: Replaces existing property values
Mixins.of(bucket).apply(new CfnBucketPropsMixin(
  { versioningConfiguration: { status: "Enabled" } },
  { strategy: PropertyMergeStrategy.OVERRIDE }
));
```

Property mixins are available for all AWS services:

```typescript
import { CfnLogGroupPropsMixin } from '@aws-cdk/mixins-preview/aws-logs/mixins';
import { CfnFunctionPropsMixin } from '@aws-cdk/mixins-preview/aws-lambda/mixins';
import { CfnTablePropsMixin } from '@aws-cdk/mixins-preview/aws-dynamodb/mixins';
```

---

## EventBridge Event Patterns

CDK Mixins automatically generates typed EventBridge event patterns for AWS resources. These patterns work with both L1 and L2 constructs, providing a consistent interface for creating EventBridge rules.

### Event Patterns Basic Usage

```typescript
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

// Works with L2 constructs
const myBucket = new s3.Bucket(scope, 'Bucket');
const bucketEvents = BucketEvents.fromBucket(myBucket);
declare const fn: lambda.Function;

new events.Rule(scope, 'Rule', {
  eventPattern: bucketEvents.objectCreatedPattern({
    object: { key: events.Match.wildcard('uploads/*') },
  }),
  targets: [new targets.LambdaFunction(fn)]
});

// Also works with L1 constructs
const cfnBucket = new s3.CfnBucket(scope, 'CfnBucket');
const cfnBucketEvents = BucketEvents.fromBucket(cfnBucket);

new events.CfnRule(scope, 'CfnRule', {
  state: 'ENABLED',
  eventPattern: cfnBucketEvents.objectCreatedPattern({
    object: { key: events.Match.wildcard('uploads/*') },
  }),
  targets: [{ arn: fn.functionArn, id: 'L1' }]
});
```

### Event Pattern Features

**Automatic Resource Injection**: Resource identifiers are automatically included in patterns

```typescript
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';

const bucketEvents = BucketEvents.fromBucket(bucket);

// Bucket name is automatically injected from the bucket reference
const pattern = bucketEvents.objectCreatedPattern();
// pattern.detail.bucket.name === bucket.bucketName
```

**Event Metadata Support**: Control EventBridge pattern metadata

```typescript
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';

const bucketEvents = BucketEvents.fromBucket(bucket);

const pattern = bucketEvents.objectCreatedPattern({
  eventMetadata: {
    region: events.Match.prefix('us-'),
    version: ['0']
  }
});
```

### Available Events

Event patterns are generated for EventBridge events available in the AWS Event Schema Registry. Common examples:

**S3 Events**:

* `objectCreatedPattern()` - Object creation events
* `objectDeletedPattern()` - Object deletion events
* `objectTagsAddedPattern()` - Object tagging events
* `awsAPICallViaCloudTrailPattern()` - CloudTrail API calls

Import events from service-specific modules:

```typescript
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';
```
