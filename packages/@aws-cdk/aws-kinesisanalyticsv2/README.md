# Kinesis Analytics V2
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->


The `@aws-cdk/aws-kinesisanalyticsv2` package provides constructs for
creating Kinesis Data Analytics applications.

For more information, see the AWS documentation for [Kinesis Data
Analytics](https://aws.amazon.com/kinesis/data-analytics/).

## Creating a Flink Kinesis Analytics Application

To create a new Flink application, use the FlinkApplication construct.

```ts
import * as ka from '@aws-cdk/aws-kinesisanalyticsv2';

const flinkApp = new ka.FlinkApplication(this, 'Application', {
  code: ka.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
  runtime: ka.FlinkRuntime.FLINK_1_11,
});
```

The `code` property can use `fromBucket` as shown above to reference a jar
file in s3 or `fromAsset` to reference a local file.

```ts
import * as ka from '@aws-cdk/aws-kinesisanalyticsv2';
import * as path from 'path';

const flinkApp = new ka.FlinkApplication(this, 'Application', {
  code: ka.ApplicationCode.fromAsset(path.join(__dirname, 'my-app.jar')),
  // ...
});
```

The `propertyGroups` property provides a way of passing arbitrary runtime
properties to your Flink application. You can use the
aws-kinesisanalytics-runtime library to [retrieve these
properties](https://docs.aws.amazon.com/kinesisanalytics/latest/java/how-properties.html#how-properties-access).

```ts
import * as ka from '@aws-cdk/aws-kinesisanalyticsv2';
import * as path from 'path';

const flinkApp = new ka.FlinkApplication(this, 'Application', {
  // ...
  propertyGroups: [
    new ka.PropertyGroup('FlinkApplicationProperties', {
      inputStreamName: 'my-input-kinesis-stream',
      outputStreamName: 'my-output-kinesis-stream',
    }),
  ],
});
```

Flink applications also have specific configuration for passing parameters
when the Flink job starts. These include parameters for checkpointing,
snapshotting, monitoring, and parallelism.

```ts
import * as ka from '@aws-cdk/aws-kinesisanalyticsv2';

const flinkApp = new ka.FlinkApplication(this, 'Application', {
  code: ka.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
  runtime: ka.FlinkRuntime.FLINK_1_11,
  checkpointingEnabled: true, // default is true
  checkpointInterval: cdk.Duration.seconds(30), // default is 1 minute
  minPausesBetweenCheckpoints: cdk.Duration.seconds(10), // default is 5 seconds
  logLevel: ka.LogLevel.ERROR, // default is INFO
  metricsLevel: ka.MetricsLevel.PARALLELISM, // default is APPLICATION
  autoScalingEnabled: false, // default is true
  parallelism: 32, // default is 1
  parallelismPerKpu: 2, // default is 1
  snapshotsEnabled: false, // default is true
  logRetention: logs.RetentionDays.ONE_WEEK, // default is TWO_YEARS
  logRemovalPolicy: core.RemovalPolicy.DESTROY, // default is RETAIN
  logGroupName: 'my-group', // default is automatically generated
  logStreamName: 'my-stream', // default is automatically generated
  logEncryptionKey: someKmsKey, // default is no encryption
});
```

## Creating an SQL Kinesis Analytics Application

Constructs for SQL applications are not implemented yet.
