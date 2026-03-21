# CDK Mixins


> **Note**: The core Mixins mechanism  is now GA  and available in `constructs` and `aws-cdk-lib` (`Mixins`, `Mixin`, `IMixin`, `MixinApplicator`, `ConstructSelector`).
> All service Mixins are now available in `aws-cdk-lib`.
> Please update your imports.
>
> This package continues to provide **Logs Delivery Mixins** and **EventBridge Event Facades**, which are still experimental.

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

CDK Mixins provide a new, advanced way to add functionality through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.
Mixins can be applied during or after construct construction.
Mixins are an _addition_, _not_ a replacement for construct properties.
By itself, they cannot change optionality of properties or change defaults.

## Usage and documentation

See the [documentation for CDK Mixins](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib-readme.html#mixins) in  `aws-cdk-lib`.

### Built-in Mixins

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

---

## EventBridge Event Patterns

CDK Mixins automatically generates typed EventBridge event patterns for AWS resources. These patterns come in two flavors: **resource-specific** and **standalone**.

### Resource-Specific Event Patterns

Resource-specific patterns are created by attaching a resource reference (e.g. an S3 bucket). The resource identifier is automatically injected into the event pattern, so calling a pattern method with no arguments still filters events to that specific resource. For example, an S3 `objectCreatedPattern()` will automatically include the bucket name in the pattern, meaning it only matches events from that particular bucket.

#### Event Patterns Basic Usage

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

#### Event Pattern Features

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

### Standalone Event Patterns

Standalone patterns are not tied to any specific resource. They match events across all resources of that type. For example, a standalone `awsAPICallViaCloudTrailPattern()` will match CloudTrail API calls for all S3 buckets in the account, not just a specific one.

#### Event Patterns Basic Usage

```typescript
import { AWSAPICallViaCloudTrail, ObjectCreated, ObjectDeleted } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const fn: lambda.Function;

// Works with L2 Rule
new events.Rule(scope, 'Rule', {
  eventPattern: AWSAPICallViaCloudTrail.awsAPICallViaCloudTrailPattern({
    tlsDetails: { tlsVersion: ['TLSv1.3'] },
    eventMetadata: { region: ['us-east-1'] },
  }),
  targets: [new targets.LambdaFunction(fn)]
});

// Also works with L1 CfnRule
new events.CfnRule(scope, 'CfnRule', {
  state: 'ENABLED',
  eventPattern: AWSAPICallViaCloudTrail.awsAPICallViaCloudTrailPattern({
    tlsDetails: { tlsVersion: ['TLSv1.3'] },
    eventMetadata: { region: ['us-east-1'] },
  }),
  targets: [{ arn: fn.functionArn, id: 'L1' }]
});
```

#### Event Pattern Features

```typescript
import { AWSAPICallViaCloudTrail } from '@aws-cdk/mixins-preview/aws-s3/events';

// Matches CloudTrail API calls across ALL S3 buckets
const pattern = AWSAPICallViaCloudTrail.awsAPICallViaCloudTrailPattern();
```

**Event Metadata Support**: Control EventBridge pattern metadata

```typescript
import { AWSAPICallViaCloudTrail } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';

const pattern = AWSAPICallViaCloudTrail.awsAPICallViaCloudTrailPattern({
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
// Resource-specific (filters to a specific bucket)
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';

// Standalone (matches across all buckets)
import { AWSAPICallViaCloudTrail, ObjectCreated, ObjectDeleted } from '@aws-cdk/mixins-preview/aws-s3/events';
```
