# CDK Mixins


> **Note**: The core Mixins mechanism is now GA and available in `constructs` and `aws-cdk-lib` (`Mixins`, `Mixin`, `IMixin`, `MixinApplicator`, `ConstructSelector`).
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
By itself, it cannot change optionality of properties or defaults.

## Usage and documentation

See the [documentation for CDK Mixins](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib-readme.html#mixins) in `aws-cdk-lib`.

### Built-in Mixins

### Logs Delivery

Vended Logs can delivery to 3 main destinations, a CloudWatch Log Group, an S3 bucket, and a Firehose Delivery Stream. Some resources (mostly Bedrock Agentcore resources) can deliver to a fourth destination, XRay Traces. Setting up Vended Logs delivery to each of these destinations, looks largely the same, you set up the resource which will be the source of the logs, you set up the resource which will be where the logs are delivered to, and you invoke the Mixin to perform the connection.

Configures Vended Logs for a CloudWatch Log Group destination:

```typescript
import * as cloudfrontMixins from '@aws-cdk/mixins-preview/aws-cloudfront/mixins';

// Create CloudFront distribution (source resource)
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

Configures Vended Logs for encrypted and unencrypted S3 Bucket destinations
For encrypted S3 buckets, if the key needs to be imported from a different stack, permissions must be added to it manually.

```typescript 
import * as eventBusMixins from '@aws-cdk/mixins-preview/aws-events/mixins';
import * as events from 'aws-cdk-lib/aws-events';

const eventBus = new events.EventBus(scope, 'EventBus', {
  eventBusName: 'my-event-bus',
  logConfig: {
    includeDetail: events.IncludeDetail.NONE,
    level: events.Level.ERROR,
  },
});

const logsBucket = new s3.Bucket(scope, 'Bucket');

eventBus.with(eventBusMixins.CfnEventBusLogsMixin.INFO_LOGS.toS3(logsBucket));

// can also set up log delivery ot encrypted buckets
const key = new kms.Key(scope, 'EncryptionKey', {
  enabled: true
});

const encryptedBucket = new s3.Bucket(scope, 'EncryptedBucket', {
  encryptionKey: key,
});

// if no key is provided, the Mixin will attempt to find it using EncryptedResources.of()
eventbus.with(eventBusMixins.CfnEventBusLogsMixin.ERROR_LOGS.toS3(encryptedBucket, { encryptionKey: key }));

```

Configures Vended Logs for a Firehose Delivery Stream destination:

```typescript
import * as eventBusMixins from '@aws-cdk/mixins-preview/aws-events/mixins';
import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as cdk from 'aws-cdk-lib/core';

const eventBus = new events.EventBus(scope, 'EventBus', {
  eventBusName: 'my-event-bus',
  logConfig: {
    includeDetail: events.IncludeDetail.NONE,
    level: events.Level.TRACE,
  },
});

const firehoseBucket = new s3.Bucket(scope, 'FirehoseBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
});

const deliveryStream = new firehose.CfnDeliveryStream(scope, 'DeliveryStream', {
  s3DestinationConfiguration: {
    bucketArn: firehoseBucket.bucketArn,
    bufferingHints: {
      intervalInSeconds: 10,
      sizeInMBs: 1,
    },
    roleArn: new iam.Role(scope, 'FirehoseRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      inlinePolicies: {
        s3: new iam.PolicyDocument({
          statements: [new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [firehoseBucket.arnForObjects('*')],
          })],
        }),
      },
    }).roleArn,
  },
  deliveryStreamEncryptionConfigurationInput: {
    keyType: 'AWS_OWNED_CMK',
  },
});

eventBus.with(eventBusMixins.CfnEventBusLogsMixin.ERROR_LOGS.toFirehose(deliveryStream));
```

Configures Vended Logs for XRay Traces (unlike the other destinations, XRay Traces do not have a resource assoicated with them):

```typescript
import * as memoryMixins from '@aws-cdk/mixins-preview/aws-bedrockagentcore/mixins';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const memory = new agentcore.CfnMemory(scope, 'Memory', {
  name: 'agentcore_memory',
  eventExpiryDuration: 7,
});

memory.with(memoryMixins.CfnMemoryLogsMixin.TRACES.toXRay());
```

When using the above methods to set up a Vended Logs configuration, the `CfnDeliveryDestination` resource is created for you as a part of the Mixin. However, there may be cases when you want to define the `CfnDeliveryDestination` resource and have the Mixin set up the rest of the connection. For those cases, use `toDestination()` when working with the Mixin.

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
const env = destBucket.env;
// Add permissions to bucket to facilitate log delivery
const bucketPolicy = new s3.BucketPolicy(scope, 'DeliveryBucketPolicy', {
  bucket: destBucket,
  document: new iam.PolicyDocument({statements: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [ new iam.ServicePrincipal('delivery.logs.amazonaws.com') ],
      actions: ['s3:PutObject'],
      resources: [`${destBucket.bucketArn}/AWSLogs/${env.account}/*`],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': env.account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:aws:logs:${env.region}:${env.account}:delivery-source:*`,
        },
      },
    })
  ]}),
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

Configures Vended Logs delivery cross account using `toDestination` (only supported for S3 and Firehose destinations):

```typescript
import * as cdk from 'aws-cdk-lib/core';
import * as logDestinations from '@aws-cdk/mixins-preview/aws-logs';
import * as cloudfrontMixins from '@aws-cdk/mixins-preview/aws-cloudfront/mixins';

const destinationAccount = '123456789012';
const sourceAccount = '234567890123';
const region = 'us-east-1';

class DestinationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create destination bucket
    const destBucket = new s3.Bucket(this, 'DeliveryBucket');
    new logDestinations.S3DeliveryDestination(this, 'Destination', {
      bucket: destBucket,
      sourceAccountId: sourceAccount,
    });
  }
}

declare const origin: s3.IBucket;

class SourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(origin),
      },
    });

    const destination = logs.CfnDeliveryDestination.fromDeliveryDestinationArn(this, 'Destination', `arn:aws:logs:${region}:${destinationAccount}:delivery-destination:<name of delivery destination>`);

    distribution
      .with(cloudfrontMixins.CfnDistributionLogsMixin.CONNECTION_LOGS.toDestination(destination));
  }
}

const app = new App();

const destStack = new DestinationStack(app, 'destination-stack', {
  env: {
    account: destinationAccount,
    region,
  },
});

const sourceStack = new SourceStack(app, 'source-stack', {
  env: {
    account: sourceAccount,
    region,
  },
});
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

Standalone patterns are not tied to any specific resource. They match events across all resources of that type. For example, a standalone `AWSAPICallViaCloudTrail.eventPattern()` will match CloudTrail API calls for all S3 buckets in the account, not just a specific one.

#### Event Patterns Basic Usage

```typescript
import { AWSAPICallViaCloudTrail, ObjectCreated, ObjectDeleted } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const fn: lambda.Function;

// Works with L2 Rule
new events.Rule(scope, 'Rule', {
  eventPattern: AWSAPICallViaCloudTrail.eventPattern({
    tlsDetails: { tlsVersion: ['TLSv1.3'] },
    eventMetadata: { region: ['us-east-1'] },
  }),
  targets: [new targets.LambdaFunction(fn)]
});

// Also works with L1 CfnRule
new events.CfnRule(scope, 'CfnRule', {
  state: 'ENABLED',
  eventPattern: AWSAPICallViaCloudTrail.eventPattern({
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
const pattern = AWSAPICallViaCloudTrail.eventPattern();
```

**Event Metadata Support**: Control EventBridge pattern metadata

```typescript
import { AWSAPICallViaCloudTrail } from '@aws-cdk/mixins-preview/aws-s3/events';
import * as events from 'aws-cdk-lib/aws-events';

const pattern = AWSAPICallViaCloudTrail.eventPattern({
  eventMetadata: {
    region: events.Match.prefix('us-'),
    version: ['0']
  }
});
```

### Available Events

Event patterns are generated for EventBridge events available in the AWS Event Schema Registry. Common examples:

**S3 Events**:

* `ObjectCreated.eventPattern()` - Object creation events
* `ObjectDeleted.eventPattern()` - Object deletion events
* `ObjectTagsAdded.eventPattern()` - Object tagging events
* `AWSAPICallViaCloudTrail.eventPattern()` - CloudTrail API calls

Import events from service-specific modules:

```typescript
// Resource-specific (filters to a specific bucket)
import { BucketEvents } from '@aws-cdk/mixins-preview/aws-s3/events';

// Standalone (matches across all buckets)
import { AWSAPICallViaCloudTrail, ObjectCreated, ObjectDeleted } from '@aws-cdk/mixins-preview/aws-s3/events';
```
