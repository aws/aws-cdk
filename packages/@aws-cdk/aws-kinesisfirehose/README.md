# Amazon Kinesis Data Firehose Construct Library
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

[Amazon Kinesis Data Firehose](https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html)
is a service for fully-managed delivery of real-time streaming data to storage services
such as Amazon S3, Amazon Redshift, Amazon Elasticsearch, Splunk, or any custom HTTP
endpoint or third-party services such as Datadog, Dynatrace, LogicMonitor, MongoDB, New
Relic, and Sumo Logic.

Kinesis Data Firehose delivery streams are distinguished from Kinesis data streams in
their models of consumtpion. Whereas consumers read from a data stream by actively pulling
data from the stream, a delivery stream pushes data to its destination on a regular
cadence. This means that data streams are intended to have consumers that do on-demand
processing, like AWS Lambda or Amazon EC2. On the other hand, delivery streams are
intended to have destinations that are sources for offline processing and analytics, such
as Amazon S3 and Amazon Redshift.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk)
project. It allows you to define Kinesis Data Firehose delivery streams.

## Defining a Delivery Stream

In order to define a Delivery Stream, you must specify a destination. An S3 bucket can be
used as a destination. More supported destinations are covered [below](#destinations).

```ts
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';
import * as s3 from '@aws-cdk/aws-s3';

const bucket = new s3.Bucket(this, 'Bucket');
new DeliveryStream(this, 'Delivery Stream', {
  destinations: [new destinations.S3Bucket(bucket)],
});
```

The above example defines the following resources:

- An S3 bucket
- A Kinesis Data Firehose delivery stream with Direct PUT as the source and CloudWatch
  error logging turned on.
- An IAM role which gives the delivery stream permission to write to the S3 bucket.

## Sources

There are two main methods of sourcing input data: Kinesis Data Streams and via a "direct
put". This construct library currently only supports "direct put". See [#15500](https://github.com/aws/aws-cdk/issues/15500) to track the status of adding support for Kinesis Data Streams.

See: [Sending Data to a Delivery Stream](https://docs.aws.amazon.com/firehose/latest/dev/basic-write.html)
in the *Kinesis Data Firehose Developer Guide*.

### Direct Put

Data must be provided via "direct put", ie., by using a `PutRecord` or `PutRecordBatch` API call. There are a number of ways of doing
so, such as:

- Kinesis Agent: a standalone Java application that monitors and delivers files while
  handling file rotation, checkpointing, and retries. See: [Writing to Kinesis Data Firehose Using Kinesis Agent](https://docs.aws.amazon.com/firehose/latest/dev/writing-with-agents.html)
  in the *Kinesis Data Firehose Developer Guide*.
- AWS SDK: a general purpose solution that allows you to deliver data to a delivery stream
  from anywhere using Java, .NET, Node.js, Python, or Ruby. See: [Writing to Kinesis Data Firehose Using the AWS SDK](https://docs.aws.amazon.com/firehose/latest/dev/writing-with-sdk.html)
  in the *Kinesis Data Firehose Developer Guide*.
- CloudWatch Logs: subscribe to a log group and receive filtered log events directly into
  a delivery stream. See: [logs-destinations](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-logs-destinations-readme.html).
- Eventbridge: add an event rule target to send events to a delivery stream based on the
  rule filtering. See: [events-targets](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-events-targets-readme.html).
- SNS: add a subscription to send all notifications from the topic to a delivery
  stream. See: [sns-subscriptions](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sns-subscriptions-readme.html).
- IoT: add an action to an IoT rule to send various IoT information to a delivery stream

## Destinations

The following destinations are supported. See [kinesisfirehose-destinations](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-kinesisfirehose-destinations-readme.html)
for the implementations of these destinations.

### S3

Defining a delivery stream with an S3 bucket destination:

```ts
import * as s3 from '@aws-cdk/aws-s3';
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';

const bucket = new s3.Bucket(this, 'Bucket');

const s3Destination = new destinations.S3Bucket(bucket);

new DeliveryStream(this, 'Delivery Stream', {
  destinations: [s3Destination],
});
```

## Monitoring

Kinesis Data Firehose is integrated with CloudWatch, so you can monitor the performance of
your delivery streams via logs and metrics.

### Logs

Kinesis Data Firehose will send logs to CloudWatch when data transformation or data
delivery fails. The CDK will enable logging by default and create a CloudWatch LogGroup
and LogStream for your Delivery Stream.

You can provide a specific log group to specify where the CDK will create the log streams
where log events will be sent:

```ts fixture=with-bucket
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';
import * as logs from '@aws-cdk/aws-logs';

const logGroup = new logs.LogGroup(this, 'Log Group');
const destination = new destinations.S3Bucket(bucket, {
  logGroup: logGroup,
});
new DeliveryStream(this, 'Delivery Stream', {
  destinations: [destination],
});
```

Logging can also be disabled:

```ts fixture=with-bucket
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';

const destination = new destinations.S3Bucket(bucket, {
  logging: false,
});
new DeliveryStream(this, 'Delivery Stream', {
  destinations: [destination],
});
```

See: [Monitoring using CloudWatch Logs](https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-logs.html)
in the *Kinesis Data Firehose Developer Guide*.

## Specifying an IAM role

The DeliveryStream class automatically creates IAM service roles with all the minimum
necessary permissions for Kinesis Data Firehose to access the resources referenced by your
delivery stream. One service role is created for the delivery stream that allows Kinesis
Data Firehose to read from a Kinesis data stream (if one is configured as the delivery
stream source) and for server-side encryption. Another service role is created for each
destination, which gives Kinesis Data Firehose write access to the destination resource,
as well as the ability to invoke data transformers and read schemas for record format
conversion. If you wish, you may specify your own IAM role for either the delivery stream
or the destination service role, or both. It must have the correct trust policy (it must
allow Kinesis Data Firehose to assume it) or delivery stream creation or data delivery
will fail. Other required permissions to destination resources, encryption keys, etc.,
will be provided automatically.

```ts fixture=with-bucket
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';
import * as iam from '@aws-cdk/aws-iam';

// Create service roles for the delivery stream and destination.
// These can be used for other purposes and granted access to different resources.
// They must include the Kinesis Data Firehose service principal in their trust policies.
// Two separate roles are shown below, but the same role can be used for both purposes.
const deliveryStreamRole = new iam.Role(this, 'Delivery Stream Role', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});
const destinationRole = new iam.Role(this, 'Destination Role', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});

// Specify the roles created above when defining the destination and delivery stream.
const destination = new destinations.S3Bucket(bucket, { role: destinationRole });
new DeliveryStream(this, 'Delivery Stream', {
  destinations: [destination],
  role: deliveryStreamRole,
});
```

See [Controlling Access](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html)
in the *Kinesis Data Firehose Developer Guide*.

## Granting application access to a delivery stream

IAM roles, users or groups which need to be able to work with delivery streams should be
granted IAM permissions.

Any object that implements the `IGrantable` interface (ie., has an associated principal)
can be granted permissions to a delivery stream by calling:

- `grantPutRecords(principal)` - grants the principal the ability to put records onto the
  delivery stream
- `grant(principal, ...actions)` - grants the principal permission to a custom set of
  actions

```ts fixture=with-delivery-stream
import * as iam from '@aws-cdk/aws-iam';
const lambdaRole = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

// Give the role permissions to write data to the delivery stream
deliveryStream.grantPutRecords(lambdaRole);
```

The following write permissions are provided to a service principal by the `grantPutRecords()` method:

- `firehose:PutRecord`
- `firehose:PutRecordBatch`

## Granting a delivery stream access to a resource

Conversely to the above, Kinesis Data Firehose requires permissions in order for delivery
streams to interact with resources that you own. For example, if an S3 bucket is specified
as a destination of a delivery stream, the delivery stream must be granted permissions to
put and get objects from the bucket. When using the built-in AWS service destinations
found in the `@aws-cdk/aws-kinesisfirehose-destinations` module, the CDK grants the
permissions automatically. However, custom or third-party destinations may require custom
permissions. In this case, use the delivery stream as an `IGrantable`, as follows:

```ts fixture=with-delivery-stream
import * as lambda from '@aws-cdk/aws-lambda';

const fn = new lambda.Function(this, 'Function', {
  code: lambda.Code.fromInline('exports.handler = (event) => {}'),
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
});

fn.grantInvoke(deliveryStream);
```

## Multiple destinations

Though the delivery stream allows specifying an array of destinations, only one
destination per delivery stream is currently allowed. This limitation is enforced at CDK
synthesis time and will throw an error.
