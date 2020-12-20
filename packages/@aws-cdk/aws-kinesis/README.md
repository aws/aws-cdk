# Amazon Kinesis Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

[Amazon Kinesis](https://docs.aws.amazon.com/streams/latest/dev/introduction.html) provides collection and processing of large
[streams](https://aws.amazon.com/streaming-data/) of data records in real time. Kinesis data streams can be used for rapid and continuous data
intake and aggregation.

## Table Of Contents

- [Streams](#streams)
  - [Encryption](#encryption)
  - [Import](#import)
  - [Permission Grants](#permission-grants)
    - [Read Permissions](#read-permissions)
    - [Write Permissions](#write-permissions)
    - [Custom Permissions](#custom-permissions)
  - [Metrics](#metrics)

## Streams

Amazon Kinesis Data Streams ingests a large amount of data in real time, durably stores the data, and makes the data available for consumption.

Using the CDK, a new Kinesis stream can be created as part of the stack using the construct's constructor. You may specify the `streamName` to give
your own identifier to the stream. If not, CloudFormation will generate a name.

```ts
new Stream(this, "MyFirstStream", {
  streamName: "my-awesome-stream"
});
```

You can also specify properties such as `shardCount` to indicate how many shards the stream should choose and a `retentionPeriod`
to specify how long the data in the shards should remain accessible.
Read more at [Creating and Managing Streams](https://docs.aws.amazon.com/streams/latest/dev/working-with-streams.html)

```ts
new Stream(this, "MyFirstStream", {
  streamName: "my-awesome-stream",
  shardCount: 3,
  retentionPeriod: Duration.hours(48)
});
```

### Encryption

[Stream encryption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html) enables
server-side encryption using an AWS KMS key for a specified stream.

Encryption is enabled by default on your stream with the master key owned by Kinesis Data Streams in regions where it is supported.

```ts
new Stream(this, 'MyEncryptedStream');
```

You can enable encryption on your stream with a user-managed key by specifying the `encryption` property.
A KMS key will be created for you and associated with the stream.

```ts
new Stream(this, "MyEncryptedStream", {
  encryption: StreamEncryption.KMS
});
```

You can also supply your own external KMS key to use for stream encryption by specifying the `encryptionKey` property.

```ts
import * as kms from "@aws-cdk/aws-kms";

const key = new kms.Key(this, "MyKey");

new Stream(this, "MyEncryptedStream", {
  encryption: StreamEncryption.KMS,
  encryptionKey: key
});
```

### Import

Any Kinesis stream that has been created outside the stack can be imported into your CDK app.

Streams can be imported by their ARN via the `Stream.fromStreamArn()` API

```ts
const stack = new Stack(app, "MyStack");

const importedStream = Stream.fromStreamArn(
  stack,
  "ImportedStream",
  "arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j"
);
```

Encrypted Streams can also be imported by their attributes via the `Stream.fromStreamAttributes()` API

```ts
import { Key } from "@aws-cdk/aws-kms";

const stack = new Stack(app, "MyStack");

const importedStream = Stream.fromStreamAttributes(
  stack,
  "ImportedEncryptedStream",
  {
    streamArn: "arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j",
    encryptionKey: kms.Key.fromKeyArn(
      "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
    )
  }
);
```

### Permission Grants

IAM roles, users or groups which need to be able to work with Amazon Kinesis streams at runtime should be granted IAM permissions.

Any object that implements the `IGrantable` interface (has an associated principal) can be granted permissions by calling:

- `grantRead(principal)` - grants the principal read access
- `grantWrite(principal)` - grants the principal write permissions to a Stream
- `grantReadWrite(principal)` - grants principal read and write permissions

#### Read Permissions

Grant `read` access to a stream by calling the `grantRead()` API.
If the stream has an encryption key, read permissions will also be granted to the key.

```ts
const lambdaRole = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Example role...',
}

const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.KMS
});

// give lambda permissions to read stream
stream.grantRead(lambdaRole);
```

The following read permissions are provided to a service principal by the `grantRead()` API:

- `kinesis:DescribeStreamSummary`
- `kinesis:GetRecords`
- `kinesis:GetShardIterator`
- `kinesis:ListShards`
- `kinesis:SubscribeToShard`

#### Write Permissions

Grant `write` permissions to a stream is provided by calling the `grantWrite()` API.
If the stream has an encryption key, write permissions will also be granted to the key.

```ts
const lambdaRole = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Example role...',
}

const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.KMS
});

// give lambda permissions to write to stream
stream.grantWrite(lambdaRole);
```

The following write permissions are provided to a service principal by the `grantWrite()` API:

- `kinesis:ListShards`
- `kinesis:PutRecord`
- `kinesis:PutRecords`

#### Custom Permissions

You can add any set of permissions to a stream by calling the `grant()` API.

```ts
const user = new iam.User(stack, 'MyUser');

const stream = new Stream(stack, 'MyStream');

// give my user permissions to list shards
stream.grant(user, 'kinesis:ListShards');
```

### Metrics

You can use common metrics from your stream to create alarms and/or dashboards.
Read more about Kinesis metrics at [Creating and Managing Streams](https://docs.aws.amazon.com/streams/latest/dev/working-with-streams.html)

You can find bellow a example of building a dashboard with the default metrics.

```ts
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { App, Stack } from '@aws-cdk/core';
import { Stream } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-kinesis-stream-dashboard');

const stream = new Stream(stack, 'myStream');

const dashboard = new cloudwatch.Dashboard(stack, 'StreamDashboard');

// helper function to create a GrapthWidget
function graphWidget(title: string, metric: cloudwatch.Metric) {
  return new cloudwatch.GraphWidget({
    title,
    left: [metric],
    width: 12,
    height: 5,
  });
}

// helper function to create a GraphWidget of percentage ""(count / total) * 100"
function percentGraphWidget(title: string, countMetric: cloudwatch.Metric, totalMetric: cloudwatch.Metric) {
  return new cloudwatch.GraphWidget({
    title,
    left: [new cloudwatch.MathExpression({
      expression: '( count / total ) * 100',
      usingMetrics: {
        count: countMetric,
        total: totalMetric,
      },
    })],
    width: 12,
    height: 5,
  });
}

// add widgets to build a dashboard that is similar to the one from Kinesis console
dashboard.addWidgets(
  graphWidget('Get records - sum (Bytes)', stream.metricGetRecordsBytes({ statistic: 'Sum' })),
  graphWidget('Get records iterator age - maximum (Milliseconds)', stream.metricGetRecordsIteratorAgeMilliseconds()),
  graphWidget('Get records latency - average (Milliseconds)', stream.metricGetRecordsLatency()),
  graphWidget('Get records - sum (Count)', stream.metricGetRecords({ statistic: 'Sum' })),
  graphWidget('Get records success - average (Percent)', stream.metricGetRecordsSuccess()),
  graphWidget('Incoming data - sum (Bytes)', stream.metricIncomingBytes({ statistic: 'Sum' })),
  graphWidget('Incoming records - sum (Count)', stream.metricIncomingRecords({ statistic: 'Sum' })),
  graphWidget('Put record - sum (Bytes)', stream.metricPutRecordBytes({ statistic: 'Sum' })),
  graphWidget('Put record latency - average (Milliseconds)', stream.metricPutRecordLatency()),
  graphWidget('Put record success - average (Percent)', stream.metricPutRecordSuccess()),
  graphWidget('Put records - sum (Bytes)', stream.metricPutRecordsBytes({ statistic: 'Sum' })),
  graphWidget('Put records latency - average (Milliseconds)', stream.metricPutRecordsLatency()),
  graphWidget('Read throughput exceeded - average (Percent)', stream.metricReadProvisionedThroughputExceeded()),
  graphWidget('Write throughput exceeded - average (Count)', stream.metricWriteProvisionedThroughputExceeded()),
  percentGraphWidget('Put records successful records - average (Percent)',
    stream.metricPutRecordsSuccessfulRecords(), stream.metricPutRecordsTotalRecords()),
  percentGraphWidget('Put records failed records - average (Percent)',
    stream.metricPutRecordsFailedRecords(), stream.metricPutRecordsTotalRecords()),
  percentGraphWidget('Put records throttled records - average (Percent)',
    stream.metricPutRecordsThrottledRecords(), stream.metricPutRecordsTotalRecords()),
);

```
