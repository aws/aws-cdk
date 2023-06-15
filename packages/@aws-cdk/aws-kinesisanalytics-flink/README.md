# Kinesis Analytics Flink 
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This package provides constructs for creating Kinesis Analytics Flink
applications. To learn more about using using managed Flink applications, see
the [AWS developer
guide](https://docs.aws.amazon.com/kinesisanalytics/latest/java/).

## Creating Flink Applications

To create a new Flink application, use the `Application` construct:

[simple flink application](test/integ.application.lit.ts)

The `code` property can use `fromAsset` as shown above to reference a local jar
file in s3 or `fromBucket` to reference a file in s3.

[flink application using code from bucket](test/integ.application-code-from-bucket.lit.ts)

The `propertyGroups` property provides a way of passing arbitrary runtime
properties to your Flink application. You can use the
aws-kinesisanalytics-runtime library to [retrieve these
properties](https://docs.aws.amazon.com/kinesisanalytics/latest/java/how-properties.html#how-properties-access).

```ts
declare const bucket: s3.Bucket;
const flinkApp = new flink.Application(this, 'Application', {
  propertyGroups: {
    FlinkApplicationProperties: {
      inputStreamName: 'my-input-kinesis-stream',
      outputStreamName: 'my-output-kinesis-stream',
    },
  },
  // ...
  runtime: flink.Runtime.FLINK_1_13,
  code: flink.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
});
```

Flink applications also have specific configuration for passing parameters
when the Flink job starts. These include parameters for checkpointing,
snapshotting, monitoring, and parallelism.

```ts
declare const bucket: s3.Bucket;
const flinkApp = new flink.Application(this, 'Application', {
  code: flink.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
  runtime: flink.Runtime.FLINK_1_13,
  checkpointingEnabled: true, // default is true
  checkpointInterval: Duration.seconds(30), // default is 1 minute
  minPauseBetweenCheckpoints: Duration.seconds(10), // default is 5 seconds
  logLevel: flink.LogLevel.ERROR, // default is INFO
  metricsLevel: flink.MetricsLevel.PARALLELISM, // default is APPLICATION
  autoScalingEnabled: false, // default is true
  parallelism: 32, // default is 1
  parallelismPerKpu: 2, // default is 1
  snapshotsEnabled: false, // default is true
  logGroup: new logs.LogGroup(this, 'LogGroup'), // by default, a new LogGroup will be created
});
```
