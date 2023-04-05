# AWS Lambda Event Sources


An event source mapping is an AWS Lambda resource that reads from an event source and invokes a Lambda function.
You can use event source mappings to process items from a stream or queue in services that don't invoke Lambda
functions directly. Lambda provides event source mappings for the following services. Read more about lambda
event sources [here](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html).

This module includes classes that allow using various AWS services as event
sources for AWS Lambda via the high-level `lambda.addEventSource(source)` API.

NOTE: In most cases, it is also possible to use the resource APIs to invoke an
AWS Lambda function. This library provides a uniform API for all Lambda event
sources regardless of the underlying mechanism they use.

The following code sets up a lambda function with an SQS queue event source -

```ts
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

declare const fn: lambda.Function;
const queue = new sqs.Queue(this, 'MyQueue');
const eventSource = new SqsEventSource(queue);
fn.addEventSource(eventSource);

const eventSourceId = eventSource.eventSourceMappingId;
```

The `eventSourceId` property contains the event source id. This will be a
[token](https://docs.aws.amazon.com/cdk/latest/guide/tokens.html) that will resolve to the final value at the time of
deployment.

## SQS

Amazon Simple Queue Service (Amazon SQS) allows you to build asynchronous
workflows. For more information about Amazon SQS, see Amazon Simple Queue
Service. You can configure AWS Lambda to poll for these messages as they arrive
and then pass the event to a Lambda function invocation. To view a sample event,
see [Amazon SQS Event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-sqs).

To set up Amazon Simple Queue Service as an event source for AWS Lambda, you
first create or update an Amazon SQS queue and select custom values for the
queue parameters. The following parameters will impact Amazon SQS's polling
behavior:

* __visibilityTimeout__: May impact the period between retries.
* __receiveMessageWaitTime__: Will determine [long
  poll](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html)
  duration. The default value is 20 seconds.
* __batchSize__: Determines how many records are buffered before invoking your lambda function.
* __maxBatchingWindow__: The maximum amount of time to gather records before invoking the lambda. This increases the likelihood of a full batch at the cost of delayed processing.
* __maxConcurrency__: The maximum concurrency setting limits the number of concurrent instances of the function that an Amazon SQS event source can invoke.
* __enabled__: If the SQS event source mapping should be enabled. The default is true.

```ts
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const queue = new sqs.Queue(this, 'MyQueue', {
  visibilityTimeout: Duration.seconds(30),      // default,
  receiveMessageWaitTime: Duration.seconds(20), // default
});
declare const fn: lambda.Function;

fn.addEventSource(new SqsEventSource(queue, {
  batchSize: 10, // default
  maxBatchingWindow: Duration.minutes(5),
  reportBatchItemFailures: true, // default to false
}));
```

## S3

You can write Lambda functions to process S3 bucket events, such as the
object-created or object-deleted events. For example, when a user uploads a
photo to a bucket, you might want Amazon S3 to invoke your Lambda function so
that it reads the image and creates a thumbnail for the photo.

You can use the bucket notification configuration feature in Amazon S3 to
configure the event source mapping, identifying the bucket events that you want
Amazon S3 to publish and which Lambda function to invoke.

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const bucket = new s3.Bucket(this, 'mybucket');
declare const fn: lambda.Function;

fn.addEventSource(new S3EventSource(bucket, {
  events: [ s3.EventType.OBJECT_CREATED, s3.EventType.OBJECT_REMOVED ],
  filters: [ { prefix: 'subdir/' } ], // optional
}));
```

## SNS

You can write Lambda functions to process Amazon Simple Notification Service
notifications. When a message is published to an Amazon SNS topic, the service
can invoke your Lambda function by passing the message payload as a parameter.
Your Lambda function code can then process the event, for example publish the
message to other Amazon SNS topics, or send the message to other AWS services.

This also enables you to trigger a Lambda function in response to Amazon
CloudWatch alarms and other AWS services that use Amazon SNS.

For an example event, see [Appendix: Message and JSON
Formats](https://docs.aws.amazon.com/sns/latest/dg/json-formats.html) and
[Amazon SNS Sample
Event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-sns).
For an example use case, see [Using AWS Lambda with Amazon SNS from Different
Accounts](https://docs.aws.amazon.com/lambda/latest/dg/with-sns.html).

```ts
import * as sns from 'aws-cdk-lib/aws-sns';
import { SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

declare const topic: sns.Topic;
const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');

declare const fn: lambda.Function;
fn.addEventSource(new SnsEventSource(topic, {
  filterPolicy: { },
  deadLetterQueue: deadLetterQueue,
}));
```

When a user calls the SNS Publish API on a topic that your Lambda function is
subscribed to, Amazon SNS will call Lambda to invoke your function
asynchronously. Lambda will then return a delivery status. If there was an error
calling Lambda, Amazon SNS will retry invoking the Lambda function up to three
times. After three tries, if Amazon SNS still could not successfully invoke the
Lambda function, then Amazon SNS will send a delivery status failure message to
CloudWatch.

## DynamoDB Streams

You can write Lambda functions to process change events from a DynamoDB Table. An event is emitted to a DynamoDB stream (if configured) whenever a write (Put, Delete, Update)
operation is performed against the table. See [Using AWS Lambda with Amazon DynamoDB](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html) for more information about configuring Lambda function event sources with DynamoDB.

To process events with a Lambda function, first create or update a DynamoDB table and enable a `stream` specification. Then, create a `DynamoEventSource`
and add it to your Lambda function. The following parameters will impact Amazon DynamoDB's polling behavior:

* __batchSize__: Determines how many records are buffered before invoking your lambda function - could impact your function's memory usage (if too high) and ability to keep up with incoming data velocity (if too low).
* __bisectBatchOnError__: If a batch encounters an error, this will cause the batch to be split in two and have each new smaller batch retried, allowing the records in error to be isolated.
* __reportBatchItemFailures__: Allow functions to return partially successful responses for a batch of records.
* __maxBatchingWindow__: The maximum amount of time to gather records before invoking the lambda. This increases the likelihood of a full batch at the cost of delayed processing.
* __maxRecordAge__: The maximum age of a record that will be sent to the function for processing. Records that exceed the max age will be treated as failures.
* __onFailure__: In the event a record fails after all retries or if the record age has exceeded the configured value, the record will be sent to SQS queue or SNS topic that is specified here
* __parallelizationFactor__: The number of batches to concurrently process on each shard.
* __retryAttempts__: The maximum number of times a record should be retried in the event of failure.
* __startingPosition__: Will determine where to being consumption, either at the most recent ('LATEST') record or the oldest record ('TRIM_HORIZON'). 'TRIM_HORIZON' will ensure you process all available data, while 'LATEST' will ignore all records that arrived prior to attaching the event source.
* __tumblingWindow__: The duration in seconds of a processing window when using streams.
* __enabled__: If the DynamoDB Streams event source mapping should be enabled. The default is true.

```ts
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { DynamoEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';

declare const table: dynamodb.Table;

const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');

declare const fn: lambda.Function;
fn.addEventSource(new DynamoEventSource(table, {
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  batchSize: 5,
  bisectBatchOnError: true,
  onFailure: new SqsDlq(deadLetterQueue),
  retryAttempts: 10,
}));
```

## Kinesis

You can write Lambda functions to process streaming data in Amazon Kinesis Streams. For more information about Amazon Kinesis, see [Amazon Kinesis
Service](https://aws.amazon.com/kinesis/data-streams/). To learn more about configuring Lambda function event sources with kinesis and view a sample event,
see [Amazon Kinesis Event](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html).

To set up Amazon Kinesis as an event source for AWS Lambda, you
first create or update an Amazon Kinesis stream and select custom values for the
event source parameters. The following parameters will impact Amazon Kinesis's polling
behavior:

* __batchSize__: Determines how many records are buffered before invoking your lambda function - could impact your function's memory usage (if too high) and ability to keep up with incoming data velocity (if too low).
* __bisectBatchOnError__: If a batch encounters an error, this will cause the batch to be split in two and have each new smaller batch retried, allowing the records in error to be isolated.
* __reportBatchItemFailures__: Allow functions to return partially successful responses for a batch of records.
* __maxBatchingWindow__: The maximum amount of time to gather records before invoking the lambda. This increases the likelihood of a full batch at the cost of possibly delaying processing.
* __maxRecordAge__: The maximum age of a record that will be sent to the function for processing. Records that exceed the max age will be treated as failures.
* __onFailure__: In the event a record fails and consumes all retries, the record will be sent to SQS queue or SNS topic that is specified here
* __parallelizationFactor__: The number of batches to concurrently process on each shard.
* __retryAttempts__: The maximum number of times a record should be retried in the event of failure.
* __startingPosition__: Will determine where to begin consumption. 'LATEST' will start at the most recent record and ignore all records that arrived prior to attaching the event source, 'TRIM_HORIZON' will start at the oldest record and ensure you process all available data, while 'AT_TIMESTAMP' will start reading records from a specified time stamp. Note that 'AT_TIMESTAMP' is only supported for Amazon Kinesis streams.
* __startingPositionTimestamp__: The time stamp from which to start reading. Used in conjunction with __startingPosition__ when set to 'AT_TIMESTAMP'.
* __tumblingWindow__: The duration in seconds of a processing window when using streams.
* __enabled__: If the DynamoDB Streams event source mapping should be enabled. The default is true.

```ts
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const stream = new kinesis.Stream(this, 'MyStream');

declare const myFunction: lambda.Function;
myFunction.addEventSource(new KinesisEventSource(stream, {
  batchSize: 100, // default
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
}));
```

## Kafka

You can write Lambda functions to process data either from [Amazon MSK](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html) or a [self managed Kafka](https://docs.aws.amazon.com/lambda/latest/dg/kafka-smaa.html) cluster.

The following code sets up Amazon MSK as an event source for a lambda function. Credentials will need to be configured to access the
MSK cluster, as described in [Username/Password authentication](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html).

```ts
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

// Your MSK cluster arn
const clusterArn = 'arn:aws:kafka:us-east-1:0123456789019:cluster/SalesCluster/abcd1234-abcd-cafe-abab-9876543210ab-4';

// The Kafka topic you want to subscribe to
const topic = 'some-cool-topic';

// The secret that allows access to your MSK cluster
// You still have to make sure that it is associated with your cluster as described in the documentation
const secret = new Secret(this, 'Secret', { secretName: 'AmazonMSK_KafkaSecret' });

declare const myFunction: lambda.Function;
myFunction.addEventSource(new ManagedKafkaEventSource({
  clusterArn,
  topic: topic,
  secret: secret,
  batchSize: 100, // default
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
}));
```

The following code sets up a self managed Kafka cluster as an event source. Username and password based authentication
will need to be set up as described in [Managing access and permissions](https://docs.aws.amazon.com/lambda/latest/dg/smaa-permissions.html#smaa-permissions-add-secret).

```ts
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

// The list of Kafka brokers
const bootstrapServers = ['kafka-broker:9092'];

// The Kafka topic you want to subscribe to
const topic = 'some-cool-topic';

// The secret that allows access to your self hosted Kafka cluster
declare const secret: Secret;

// (Optional) The secret containing the root CA certificate that your Kafka brokers use for TLS encryption
declare const encryption: Secret;

// (Optional) The consumer group id to use when connecting to the Kafka broker. If omitted the UUID of the event source mapping will be used.
const consumerGroupId: "my-consumer-group-id";

declare const myFunction: lambda.Function;
myFunction.addEventSource(new SelfManagedKafkaEventSource({
  bootstrapServers: bootstrapServers,
  topic: topic,
  consumerGroupId: consumerGroupId,
  secret: secret,
  batchSize: 100, // default
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  encryption: encryption // optional
}));
```

If your self managed Kafka cluster is only reachable via VPC also configure `vpc` `vpcSubnets` and `securityGroup`.

## Roadmap

Eventually, this module will support all the event sources described under
[Supported Event
Sources](https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html)
in the AWS Lambda Developer Guide.
