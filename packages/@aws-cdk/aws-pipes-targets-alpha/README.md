# Amazon EventBridge Pipes Targets Construct Library

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


EventBridge Pipes Targets let you create a target for an EventBridge Pipe.

For more details see the [service documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html).

## Targets

Pipe targets are the end point of an EventBridge Pipe. The following targets are supported:

* `targets.ApiDestinationTarget`: [Send event source to an EventBridge API destination](#amazon-eventbridge-api-destination)
* `targets.ApiGatewayTarget`: [Send event source to an API Gateway REST API](#amazon-api-gateway-rest-api)
* `targets.CloudWatchLogsTarget`: [Send event source to a CloudWatch Logs log group](#amazon-cloudwatch-logs-log-group)
* `targets.EventBridgeTarget`: [Send event source to an EventBridge event bus](#amazon-eventbridge-event-bus)
* `targets.FirehoseTarget`: [Send event source to an Amazon Data Firehose delivery stream](#amazon-data-firehose-delivery-stream)
* `targets.KinesisTarget`: [Send event source to a Kinesis data stream](#amazon-kinesis-data-stream)
* `targets.LambdaFunction`: [Send event source to a Lambda function](#aws-lambda-function)
* `targets.SageMakerTarget`: [Send event source to a SageMaker pipeline](#amazon-sagemaker-pipeline)
* `targets.SfnStateMachine`: [Invoke a Step Functions state machine from an event source](#aws-step-functions-state-machine)
* `targets.SnsTarget`: [Send event source to an SNS topic](#amazon-sns-topic)
* `targets.SqsTarget`: [Send event source to an SQS queue](#amazon-sqs-queue)

### Amazon EventBridge API Destination

An EventBridge API destination can be used as a target for a pipe.
The API destination will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const dest: events.ApiDestination;

const apiTarget = new targets.ApiDestinationTarget(dest);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```

The input to the target API destination can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const dest: events.ApiDestination;

const apiTarget = new targets.ApiDestinationTarget(dest, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```

### Amazon API Gateway Rest API

A REST API can be used as a target for a pipe.
The REST API will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;

const fn = new lambda.Function( this, 'MyFunc', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
  code: lambda.Code.fromInline( 'exports.handler = e => {}' ),
});

const restApi = new api.LambdaRestApi( this, 'MyRestAPI', { handler: fn } );
const apiTarget = new targets.ApiGatewayTarget(restApi);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```

The input to the target REST API can be transformed:

```ts
declare const sourceQueue: sqs.Queue;

const fn = new lambda.Function( this, 'MyFunc', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
  code: lambda.Code.fromInline( 'exports.handler = e => {}' ),
});

const restApi = new api.LambdaRestApi( this, 'MyRestAPI', { handler: fn } );
const apiTarget = new targets.ApiGatewayTarget(restApi, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```

### Amazon CloudWatch Logs Log Group

A CloudWatch Logs log group can be used as a target for a pipe.
The log group will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetLogGroup: logs.LogGroup;

const logGroupTarget = new targets.CloudWatchLogsTarget(targetLogGroup);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: logGroupTarget,
});
```

The input to the target log group can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetLogGroup: logs.LogGroup;

const logGroupTarget = new targets.CloudWatchLogsTarget(targetLogGroup, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: logGroupTarget,
});
```

### Amazon EventBridge Event Bus

An EventBridge event bus can be used as a target for a pipe.
The event bus will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetEventBus: events.EventBus;

const eventBusTarget = new targets.EventBridgeTarget(targetEventBus);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: eventBusTarget,
});
```

The input to the target event bus can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetEventBus: events.EventBus;

const eventBusTarget = new targets.EventBridgeTarget(targetEventBus, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: eventBusTarget,
});
```

### Amazon Data Firehose Delivery Stream

An Amazon Data Firehose delivery stream can be used as a target for a pipe.
The delivery stream will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetDeliveryStream: firehose.DeliveryStream;

const deliveryStreamTarget = new targets.FirehoseTarget(targetDeliveryStream);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: deliveryStreamTarget,
});
```

The input to the target delivery stream can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetDeliveryStream: firehose.DeliveryStream;

const deliveryStreamTarget = new targets.FirehoseTarget(targetDeliveryStream, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: deliveryStreamTarget,
});
```

### Amazon Kinesis Data Stream

A Kinesis data stream can be used as a target for a pipe.
The data stream will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStream: kinesis.Stream;

const streamTarget = new targets.KinesisTarget(targetStream, {
    partitionKey: 'pk',
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: streamTarget,
});
```

The input to the target data stream can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStream: kinesis.Stream;

const streamTarget = new targets.KinesisTarget(targetStream, {
    partitionKey: 'pk',
    inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: streamTarget,
});
```

### AWS Lambda Function

A Lambda function can be used as a target for a pipe.
The Lambda function will be invoked with the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction,{});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

The target Lambda function is invoked synchronously by default. You can also choose to invoke the Lambda Function asynchronously by setting `invocationType` property to `FIRE_AND_FORGET`.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction, {
  invocationType: targets.LambdaFunctionInvocationType.FIRE_AND_FORGET,
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

The input to the target Lambda Function can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

### Amazon SageMaker Pipeline

A SageMaker pipeline can be used as a target for a pipe.
The pipeline will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetPipeline: sagemaker.IPipeline;

const pipelineTarget = new targets.SageMakerTarget(targetPipeline);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipelineTarget,
});
```

The input to the target pipeline can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetPipeline: sagemaker.IPipeline;

const pipelineTarget = new targets.SageMakerTarget(targetPipeline, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipelineTarget,
});
```

### AWS Step Functions State Machine

A Step Functions state machine can be used as a target for a pipe.
The state machine will be invoked with the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine,{});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

You can specify the invocation type when the target state machine is invoked:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine, {
    invocationType: targets.StateMachineInvocationType.FIRE_AND_FORGET,
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

The input to the target state machine can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine,
    {
      inputTransformation: pipes.InputTransformation.fromObject({ body: '<$.body>' }),
      invocationType: targets.StateMachineInvocationType.FIRE_AND_FORGET,
    }
);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

### Amazon SNS Topic

An SNS topic can be used as a target for a pipe. 
The topic will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetTopic: sns.Topic;

const pipeTarget = new targets.SnsTarget(targetTopic);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

The target input can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetTopic: sns.Topic;

const pipeTarget = new targets.SnsTarget(targetTopic,
    {
      inputTransformation: pipes.InputTransformation.fromObject( 
        { 
            "SomeKey": pipes.DynamicInput.fromEventPath('$.body')
        })
    }
);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

### Amazon SQS Queue

An SQS queue can be used as a target for a pipe.
The queue will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeTarget = new targets.SqsTarget(targetQueue);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```

The target input can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeTarget = new targets.SqsTarget(targetQueue,
    {
      inputTransformation: pipes.InputTransformation.fromObject(
        {
            "SomeKey": pipes.DynamicInput.fromEventPath('$.body')
        })
    }
);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: pipeTarget
});
```
