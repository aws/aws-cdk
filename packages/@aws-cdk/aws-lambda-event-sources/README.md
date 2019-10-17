## AWS Lambda Event Sources
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This module includes classes that allow using various AWS services as event
sources for AWS Lambda via the high-level `lambda.addEventSource(source)` API.

NOTE: In most cases, it is also possible to use the resource APIs to invoke an
AWS Lambda function. This library provides a uniform API for all Lambda event
sources regardless of the underlying mechanism they use.

### SQS

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

```ts
import sqs = require('@aws-cdk/aws-sqs');
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Duration } from '@aws-cdk/core';

const queue = new sqs.Queue(this, 'MyQueue', {
  visibilityTimeout: Duration.seconds(30)      // default,
  receiveMessageWaitTime: Duration.seconds(20) // default
});

lambda.addEventSource(new SqsEventSource(queue, {
  batchSize: 10 // default
});
```

### S3

You can write Lambda functions to process S3 bucket events, such as the
object-created or object-deleted events. For example, when a user uploads a
photo to a bucket, you might want Amazon S3 to invoke your Lambda function so
that it reads the image and creates a thumbnail for the photo.

You can use the bucket notification configuration feature in Amazon S3 to
configure the event source mapping, identifying the bucket events that you want
Amazon S3 to publish and which Lambda function to invoke.

```ts
import s3 = require('@aws-cdk/aws-s3');
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';

const bucket = new s3.Bucket(...);

lambda.addEventSource(new S3EventSource(bucket, {
  events: [ s3.EventType.OBJECT_CREATED, s3.EventType.OBJECT_REMOVED ],
  filters: [ { prefix: 'subdir/' } ] // optional
}));
```

### SNS

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
import sns = require('@aws-cdk/aws-sns');
import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources';

const topic = new sns.Topic(...);

lambda.addEventSource(new SnsEventSource(topic));
```

When a user calls the SNS Publish API on a topic that your Lambda function is
subscribed to, Amazon SNS will call Lambda to invoke your function
asynchronously. Lambda will then return a delivery status. If there was an error
calling Lambda, Amazon SNS will retry invoking the Lambda function up to three
times. After three tries, if Amazon SNS still could not successfully invoke the
Lambda function, then Amazon SNS will send a delivery status failure message to
CloudWatch.

### DynamoDB Streams

You can write Lambda functions to process change events from a DynamoDB Table. An event is emitted to a DynamoDB stream (if configured) whenever a write (Put, Delete, Update)
operation is performed against the table. See [Using AWS Lambda with Amazon DynamoDB](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html) for more information.

To process events with a Lambda function, first create or update a DynamoDB table and enable a `stream` specification. Then, create a `DynamoEventSource`
and add it to your Lambda function. The following parameters will impact Amazon DynamoDB's polling behavior:

* __batchSize__: Determines how many records are buffered before invoking your lambda function - could impact your function's memory usage (if too high) and ability to keep up with incoming data velocity (if too low).
* __startingPosition__: Will determine where to being consumption, either at the most recent ('LATEST') record or the oldest record ('TRIM_HORIZON'). 'TRIM_HORIZON' will ensure you process all available data, while 'LATEST' will ignore all reocrds that arrived prior to attaching the event source.

```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';

const table = new dynamodb.Table(..., {
  partitionKey: ...,
  stream: dynamodb.StreamViewType.NewImage // make sure stream is configured
});

const function = new lambda.Function(...);
function.addEventSource(new DynamoEventSource(table, {
  startingPosition: lambda.StartingPosition.TrimHorizon
}));
```

### Kinesis

You can write Lambda functions to process streaming data in Amazon Kinesis Streams. For more information about Amazon SQS, see [Amazon Kinesis
Service](https://aws.amazon.com/kinesis/data-streams/). To view a sample event,
see [Amazon SQS Event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-kinesis-streams).

To set up Amazon Kinesis as an event source for AWS Lambda, you
first create or update an Amazon Kinesis stream and select custom values for the
event source parameters. The following parameters will impact Amazon Kinesis's polling
behavior:

* __batchSize__: Determines how many records are buffered before invoking your lambnda function - could impact your function's memory usage (if too high) and ability to keep up with incoming data velocity (if too low).
* __startingPosition__: Will determine where to being consumption, either at the most recent ('LATEST') record or the oldest record ('TRIM_HORIZON'). 'TRIM_HORIZON' will ensure you process all available data, while 'LATEST' will ignore all reocrds that arrived prior to attaching the event source.

```ts
import lambda = require('@aws-cdk/aws-lambda');
import kinesis = require('@aws-cdk/aws-kinesis');
import { KinesisEventSource } from '@aws-cdk/aws-lambda-event-sources';

const stream = new kinesis.Stream(this, 'MyStream');

myFunction.addEventSource(new KinesisEventSource(queue, {
  batchSize: 100, // default
  startingPosition: lambda.StartingPosition.TRIM_HORIZON
});
```

## Roadmap

Eventually, this module will support all the event sources described under
[Supported Event
Sources](https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html)
in the AWS Lambda Developer Guide.
