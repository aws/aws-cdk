# Amazon Kinesis Construct Library


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
  - [Resource Policy](#resource-policy)


## Streams

Amazon Kinesis Data Streams ingests a large amount of data in real time, durably stores the data, and makes the data available for consumption.

Using the CDK, a new Kinesis stream can be created as part of the stack using the construct's constructor. You may specify the `streamName` to give
your own identifier to the stream. If not, CloudFormation will generate a name.

```ts
new kinesis.Stream(this, 'MyFirstStream', {
  streamName: 'my-awesome-stream',
});
```

You can also specify properties such as `shardCount` to indicate how many shards the stream should choose and a `retentionPeriod`
to specify how long the data in the shards should remain accessible.
Read more at [Creating and Managing Streams](https://docs.aws.amazon.com/streams/latest/dev/working-with-streams.html)

```ts
new kinesis.Stream(this, 'MyFirstStream', {
  streamName: 'my-awesome-stream',
  shardCount: 3,
  retentionPeriod: Duration.hours(48),
});
```

### Encryption

[Stream encryption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html) enables
server-side encryption using an AWS KMS key for a specified stream.

Encryption is enabled by default on your stream with the master key owned by Kinesis Data Streams in regions where it is supported.

```ts
new kinesis.Stream(this, 'MyEncryptedStream');
```

You can enable encryption on your stream with a user-managed key by specifying the `encryption` property.
A KMS key will be created for you and associated with the stream.

```ts
new kinesis.Stream(this, 'MyEncryptedStream', {
  encryption: kinesis.StreamEncryption.KMS,
});
```

You can also supply your own external KMS key to use for stream encryption by specifying the `encryptionKey` property.

```ts
const key = new kms.Key(this, 'MyKey');

new kinesis.Stream(this, 'MyEncryptedStream', {
  encryption: kinesis.StreamEncryption.KMS,
  encryptionKey: key,
});
```

### Import

Any Kinesis stream that has been created outside the stack can be imported into your CDK app.

Streams can be imported by their ARN via the `Stream.fromStreamArn()` API

```ts
const importedStream = kinesis.Stream.fromStreamArn(this, 'ImportedStream',
  'arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j',
);
```

Encrypted Streams can also be imported by their attributes via the `Stream.fromStreamAttributes()` API

```ts
const importedStream = kinesis.Stream.fromStreamAttributes(this, 'ImportedEncryptedStream', {
  streamArn: 'arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j',
  encryptionKey: kms.Key.fromKeyArn(this, 'key',
    'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
  ),
});
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
});

const stream = new kinesis.Stream(this, 'MyEncryptedStream', {
  encryption: kinesis.StreamEncryption.KMS,
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
});

const stream = new kinesis.Stream(this, 'MyEncryptedStream', {
  encryption: kinesis.StreamEncryption.KMS,
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
const user = new iam.User(this, 'MyUser');

const stream = new kinesis.Stream(this, 'MyStream');

// give my user permissions to list shards
stream.grant(user, 'kinesis:ListShards');
```

### Metrics

You can use common metrics from your stream to create alarms and/or dashboards. The `stream.metric('MetricName')` method creates a metric with the stream namespace and dimension. You can also use pre-define methods like `stream.metricGetRecordsSuccess()`. To find out more about Kinesis metrics check [Monitoring the Amazon Kinesis Data Streams Service with Amazon CloudWatch](https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html).

```ts
const stream = new kinesis.Stream(this, 'MyStream');

// Using base metric method passing the metric name
stream.metric('GetRecords.Success');

// using pre-defined metric method
stream.metricGetRecordsSuccess();

// using pre-defined and overriding the statistic
stream.metricGetRecordsSuccess({ statistic: 'Maximum' });
```

### Resource Policy

You can create a resource policy for a data stream.
For more information, see [Controlling access to Amazon Kinesis Data Streams resources using IAM](https://docs.aws.amazon.com/streams/latest/dev/controlling-access.html).

A resource policy is automatically created when `addToResourcePolicy` is called, if one doesn't already exist.

Using `addToResourcePolicy` is the simplest way to add a resource policy:

```ts
const stream = new kinesis.Stream(this, 'MyStream');

// create a resource policy via addToResourcePolicy method
stream.addToResourcePolicy(new iam.PolicyStatement({
  resources: [stream.streamArn],
  actions: ['kinesis:GetRecords'],
  principals: [new iam.AnyPrincipal()],
}));
```

You can create a resource manually by using `ResourcePolicy`.
Also, you can set a custom policy document to `ResourcePolicy`.
If not, a blank policy document will be set.

```ts
const stream = new kinesis.Stream(this, 'MyStream');

// create a custom policy document
const policyDocument = new iam.PolicyDocument({
  assignSids: true,
  statements: [
    new iam.PolicyStatement({
      actions: ['kinesis:GetRecords'],
      resources: [stream.streamArn],
      principals: [new iam.AnyPrincipal()],
    }),
  ],
});

// create a resource policy manually
new kinesis.ResourcePolicy(this, 'ResourcePolicy', {
  stream,
  policyDocument,
});
```