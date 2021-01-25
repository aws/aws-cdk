# Kinesis Analytics V2

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
  metricsLevel: ka.MetricsLevel.PARALLELISM // default is APPLICATION
  autoScalingEnabled: false // default is true
  parallelism: 32 // default is 1
  parallelismPerKpu: 2 // default is 1
  snapshotsEnabled: false // default is true
});
```

## Creating an SQL Kinesis Analytics Application

Constructs for SQL applications are not implemented yet.
