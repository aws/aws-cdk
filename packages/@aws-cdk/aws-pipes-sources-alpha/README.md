# Amazon EventBridge Pipes Sources Construct Library

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


EventBridge Pipes Sources let you create a source for a EventBridge Pipe.


For more details see the service documentation:

[Documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-source.html)

## Pipe sources

Pipe sources are the starting point of a EventBridge Pipe. They are the source of the events that are sent to the pipe.

### Amazon SQS

A SQS message queue can be used as a source for a pipe. The queue will be polled for new messages and the messages will be sent to the pipe.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeSource = new sources.SqsSource(sourceQueue);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: pipeSource,
  target: new SqsTarget(targetQueue)
});
```

The polling configuration can be customized:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeSource = new sources.SqsSource(sourceQueue, {
  batchSize: 10,
  maximumBatchingWindow: cdk.Duration.seconds(10)
});

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: pipeSource,
  target: new SqsTarget(targetQueue)
});
```

### Amazon Kinesis

A Kinesis stream can be used as a source for a pipe. The stream will be polled for new messages and the messages will be sent to the pipe.

```ts
declare const sourceStream: kinesis.Stream;
declare const targetQueue: sqs.Queue;

const pipeSource = new sources.KinesisSource(sourceStream, {
  startingPosition: sources.KinesisStartingPosition.LATEST,
});

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: pipeSource,
  target: new SqsTarget(targetQueue)
});
```

### Amazon DynamoDB

A DynamoDB stream can be used as a source for a pipe. The stream will be polled for new messages and the messages will be sent to the pipe.

```ts
const table = new ddb.TableV2(this, 'MyTable', {
  partitionKey: {
    name: 'id',
    type: ddb.AttributeType.STRING,
  },
  dynamoStream: ddb.StreamViewType.NEW_IMAGE,
});
declare const targetQueue: sqs.Queue;

const pipeSource = new sources.DynamoDBSource(table, {
  startingPosition: sources.DynamoDBStartingPosition.LATEST,
});

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: pipeSource,
  target: new SqsTarget(targetQueue)
});
```
