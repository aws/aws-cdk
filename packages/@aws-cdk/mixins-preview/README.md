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

CDK Mixins provide a new, advanced way to add functionality through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.

## Key Benefits

* **Universal Compatibility**: Apply the same abstractions to L1 constructs, L2 constructs, or custom constructs
* **Composable Design**: Mix and match features without being locked into specific implementations  
* **Cross-Service Abstractions**: Use common patterns like encryption across different AWS services
* **Escape Hatch Freedom**: Customize resources in a safe, typed way while keeping the abstractions you want

## Basic Usage

Mixins use `Mixins.of()` as the fundamental API for applying abstractions to constructs:

```typescript
// Base form: apply mixins to any construct
const bucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(bucket)
  .apply(new EncryptionAtRest())
  .apply(new AutoDeleteObjects());
```

### Fluent Syntax with `.with()`

For convenience, you can use the `.with()` method for a more fluent syntax:

```typescript
import '@aws-cdk/mixins-preview/with';

const bucket = new s3.CfnBucket(scope, "MyBucket")
  .with(new EnableVersioning())
  .with(new AutoDeleteObjects());
```

The `.with()` method is available after importing `@aws-cdk/mixins-preview/with`, which augments all constructs with this method. It provides the same functionality as `Mixins.of().apply()` but with a more chainable API.

> **Note**: The `.with()` fluent syntax is only available in JavaScript and TypeScript. Other jsii languages (Python, Java, C#, and Go) should use the `Mixins.of(...).mustApply()` syntax instead. The import requirement is temporary during the preview phase. Once the API is stable, the `.with()` method will be available by default on all constructs and in all languages.

## Creating Custom Mixins

Mixins are simple classes that implement the `IMixin` interface:

```typescript
// Simple mixin that enables versioning
class CustomVersioningMixin implements IMixin {
  supports(construct: any): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(bucket: any): any {
    bucket.versioningConfiguration = {
      status: "Enabled"
    };
    return bucket;
  }
}

// Usage
const bucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(bucket).apply(new CustomVersioningMixin());
```

## Construct Selection

Mixins operate on construct trees and can be applied selectively:

```typescript
// Apply to all constructs in a scope
Mixins.of(scope).apply(new EncryptionAtRest());

// Apply to specific resource types
Mixins.of(scope, ConstructSelector.resourcesOfType(s3.CfnBucket))
  .apply(new EncryptionAtRest());

// Apply to constructs matching a pattern
Mixins.of(scope, ConstructSelector.byId(/.*-prod-.*/))
  .apply(new ProductionSecurityMixin());
```

## Built-in Mixins

### Cross-Service Mixins

**EncryptionAtRest**: Applies encryption to supported AWS resources

```typescript
// Works across different resource types
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new EncryptionAtRest());

const logGroup = new logs.CfnLogGroup(scope, "LogGroup");
Mixins.of(logGroup).apply(new EncryptionAtRest());
```

**VendedLogs**: Configures Vended log delivery for supported AWS Resources

```typescript
import * as cfnUserpool from '@aws-cdk/mixins-preview/aws-cognito/mixins';

// Works across different resource types
const bucket = new s3.CfnBucket(scope, "DestBucket");
const userpool = new cognito.CfnUserPool(scope, "SourceUserpool");
Mixins.of(userpool).apply(new cfnUserpool.ToBucketLogs({
  bucket,
  logType: 'APPLICATION_LOGS',
}));

Mixins.of(userpool).apply(new cfnUserpool.ToFirehoseLogs({
  stream,
  logType: 'APPLICATION_LOGS',
}));

Mixins.of(userpool).apply(new cfnUserpool.ToLogsLogs({
  logGroup,
  logType: 'APPLICATION_LOGS',
}));

const applicationLogs = new cfnUserpool.VendedLogs('APPLICATION_LOGS');
Mixins.of(userpool).apply(applicationLogs
  .toS3(bucket)
  .toFirehose(stream)
  .toLogGroup(logGroup)
);

Mixins.of(userpool).apply(cfnUserpool.APPLICATION_LOGS.toS3(bucket).toFirehose(stream).toLogGroup(logGroup));

Mixins.of(userpool).apply(cfnUserpool.VendedLogs.ofType('APPLICATION_LOGS').toS3(bucket).toFirehose(stream).toLogGroup(logGroup));
Mixins.of(userpool).apply(cfnUserpool.VendedLogs.ofType('TRACES').toXRay());

userpoolVendedLogs.applicationLogs().toS3(bucket).toFirehose(stream);
UserPoolVendedLogs.fromUserPool(userpool).applicationLogs().toS3(bucket);
// (eliminated) UserPoolVendedLogs.fromUserPool(userpool).applicationLogs(new S3DeliveryDestination(bucket), new FHDeliveryDestination(stream));
// (eliminated) UserPoolVendedLogs.fromUserPool(userpool).applicationLogs(DeliveryDestination.s3(bucket));
// (eliminated) userpool.with(UserPoolVendedLogs.applicationLogs(new S3DeliveryDestination(bucket), new FHDeliveryDestination(stream)));
// (eliminated) userpool.with(
//   UserPoolLogs.APPLICATION_LOGS.to(new S3DeliveryDestination(bucket), new FHDeliveryDestination(stream))
// );
// ****
/* winner */userpool.with(UserPoolLogs.APPLICATION_LOGS.toS3(bucket)); // cannot chain log Destinations
userpool.with(UserPoolLogs.TRACES.toS3(bucket).toFireHose(stream));
userpool.with(UserPoolLogs.TRACES.toXRay());

const applicationLogs = UserPoolLogs.APPLICATION_LOGS;
userpool.with(
  applicationLogs.toS3(bucket), 
  applicationLogs.toFireHose(stream)
);

// will have 4 interfaces with Bind (gets the source) implemented -- for each destination, will take over delivery part as well

class UserpoolLogsMixin extends IMixin {
  public static APPLICATION_LOGS: = new UserpoolApplicationLogs();
  public static TRACES: = new UserpoolTraces();

  constructor(type: string, logDelivery: interfaceWithBind) {

  }
  // validates that constuct is userpool
  public supports(Construct): boolean {
    isUserpool(construct);
  }
  public applyTo(Userpool) {
    this.supports(Userpool);
    const source = deliverySource // create the delivery srouce
    this.logDelivery.bind(source);
    return Userpool; 
  } 
}

// inside bind
const deliveryDestination = new CfnDeliveryDestination(/*use the source to bind to*/, `CDKXRayDest${Names.uniqueId(this)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });

// generated -- helper class 
class UserpoolApplicationLogs {
  public toS3(bucket): Mixin {
    const delivery = new S3LogDelivery(bucket, permissions);
    return new UserpoolLogsMixin('APPLICATIONLOGS', delivery);
  };
  public toFirehose(...);
  public toLogGroup(...);
}

class UserpoolTraces {
  public toXRay() {
    new XrayLogDelivery();
  }
}

// if log destination service is XRay, do not specify a destinationService
const gateway = new agentCore.CfnGateway(scope, "SourceGateway");
Mixins.of(userpool).apply(new VendedLogs({
  logType: 'TRACES',
}));
```

### S3-Specific Mixins

**AutoDeleteObjects**: Configures automatic object deletion for S3 buckets

```typescript
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new AutoDeleteObjects());
```

**EnableVersioning**: Enables versioning on S3 buckets

```typescript
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new EnableVersioning());
```

### L1 Property Mixins

For every CloudFormation resource, CDK Mixins automatically generates type-safe property mixins. These allow you to apply L1 properties with full TypeScript support:

```typescript
import '@aws-cdk/mixins-preview/with';
import { CfnBucketPropsMixin } from '@aws-cdk/mixins-preview/aws-s3/mixins';

const bucket = new s3.Bucket(scope, "Bucket")
  .with(new CfnBucketPropsMixin({
    versioningConfiguration: { status: "Enabled" },
    publicAccessBlockConfiguration: {
      blockPublicAcls: true,
      blockPublicPolicy: true
    }
  }));
```

Property mixins support two merge strategies:

```typescript
// MERGE (default): Deep merges properties with existing values
Mixins.of(bucket).apply(new CfnBucketPropsMixin(
  { versioningConfiguration: { status: "Enabled" } },
  { strategy: PropertyMergeStrategy.MERGE }
));

// OVERWRITE: Replaces existing property values
Mixins.of(bucket).apply(new CfnBucketPropsMixin(
  { versioningConfiguration: { status: "Enabled" } },
  { strategy: PropertyMergeStrategy.OVERWRITE }
));
```

Property mixins are available for all AWS services:

```typescript
import { CfnLogGroupMixin } from '@aws-cdk/mixins-preview/aws-logs/mixins';
import { CfnFunctionMixin } from '@aws-cdk/mixins-preview/aws-lambda/mixins';
import { CfnTableMixin } from '@aws-cdk/mixins-preview/aws-dynamodb/mixins';
```

## Error Handling

Mixins provide comprehensive error handling:

```typescript
// Graceful handling of unsupported constructs
Mixins.of(scope)
  .apply(new EncryptionAtRest()); // Skips unsupported constructs

// Strict application that requires all constructs to match
Mixins.of(scope)
  .mustApply(new EncryptionAtRest()); // Throws if no constructs support the mixin
```
