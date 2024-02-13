# Amazon EventBridge Scheduler Construct Library
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

[Amazon EventBridge Scheduler](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-scheduler/) is a feature from Amazon EventBridge
that allows you to create, run, and manage scheduled tasks at scale. With EventBridge Scheduler, you can schedule one-time or recurrently tens 
of millions of tasks across many AWS services without provisioning or managing underlying infrastructure.

This library contains integration classes for Amazon EventBridge Scheduler to call any
number of supported AWS Services. 

The following targets are supported:

1. `targets.LambdaInvoke`: [Invoke an AWS Lambda function](#invoke-a-lambda-function))
2. `targets.StepFunctionsStartExecution`: [Start an AWS Step Function](#start-an-aws-step-function)
3. `targets.CodeBuildStartBuild`: [Start a CodeBuild job](#start-a-codebuild-job)
4. `targets.SqsSendMessage`: [Send a Message to an Amazon SQS Queue](#send-a-message-to-sqs-queue)
5. `targets.SnsPublish`: [Publish messages to an Amazon SNS topic](#publish-messages-to-an-amazon-sns-topic)
6. `targets.EventBridgePutEvents`: [Put Events on EventBridge](#send-events-to-an-eventbridge-event-bus)
7. `targets.InspectorStartAssessmentRun`: [Start an Amazon Inspector assessment run](#start-an-amazon-inspector-assessment-run)
8. `targets.KinesisStreamPutRecord`: [Put a record to an Amazon Kinesis Data Streams](#put-a-record-to-an-amazon-kinesis-data-streams)
9. `targets.KinesisDataFirehosePutRecord`: [Put a record to a Kinesis Data Firehose](#put-a-record-to-a-kinesis-data-firehose)
10. `targets.CodePipelineStartPipelineExecution`: [Start a CodePipeline execution](#start-a-codepipeline-execution)
11. `targets.SageMakerStartPipelineExecution`: [Start a SageMaker pipeline execution](#start-a-sagemaker-pipeline-execution)

## Invoke a Lambda function

Use the `LambdaInvoke` target to invoke a lambda function.

The code snippet below creates an event rule with a Lambda function as a target
called every hour by Event Bridge Scheduler with custom payload. You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html).

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const fn = new lambda.Function(this, 'MyFunc', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    handler: 'index.handler',
    code: lambda.Code.fromInline(`exports.handler = handler.toString()`),
});

const dlq = new sqs.Queue(this, "DLQ", {
    queueName: 'MyDLQ',
});

const target = new targets.LambdaInvoke(fn, {
    deadLetterQueue: dlq,
    maxEventAge: Duration.minutes(1),
    retryAttempts: 3,
    input: ScheduleTargetInput.fromObject({
        'payload': 'useful'
    }),
});

const schedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.hours(1)),
    target
});
```

## Start an AWS Step Function

Use the `StepFunctionsStartExecution` target to start a new execution on a StepFunction.

The code snippet below creates an event rule with a Step Function as a target
called every hour by Event Bridge Scheduler with a custom payload.

```ts
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const payload = {
  Name: "MyParameter",
  Value: '🌥️',
};

const putParameterStep = new tasks.CallAwsService(this, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    "Name.$": '$.Name',
    "Value.$": '$.Value',
    Type: 'String',
    Overwrite: true,
  },
});

const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(putParameterStep)
});

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.hours(1)),
  target: new targets.StepFunctionsStartExecution(stateMachine, {
    input: ScheduleTargetInput.fromObject(payload),
  }),
});
```

## Start a CodeBuild job

Use the `CodeBuildStartBuild` target to start a new build run on a CodeBuild project.

The code snippet below creates an event rule with a CodeBuild project as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

declare const project: codebuild.Project;

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.CodeBuildStartBuild(project),
});
```

## Send A Message To SQS Queue

Use the `SqsSendMessage` target to send a message to SQS Queue.

The code snippet below creates an event rule with a SQS Queue as a target
called every hour by Event Bridge Scheduler with a custom payload.

Contains the `messageGroupId` to use when the target is a FIFO queue. If you specify
a FIFO queue as a target, the queue must have content-based deduplication enabled.

```ts
const payload = 'test';
const messageGroupId = 'id';
const queue = new sqs.Queue(this, 'MyQueue', {
  fifo: true,
  contentBasedDeduplication: true,
});

const target = new targets.SqsSendMessage(queue, {
    input: ScheduleTargetInput.fromText(payload),
    messageGroupId,
});

new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(1)),
    target
});
```

## Publish messages to an Amazon SNS topic

Use the `SnsPublish` target to publish messages to an Amazon SNS topic.

The code snippets below create an event rule with a Amazon SNS topic as a target.
It's called every hour by Amazon Event Bridge Scheduler with custom payload.

```ts
import * as sns from 'aws-cdk-lib/aws-sns';

const topic = new sns.Topic(this, 'Topic');

const payload = {
  message: 'Hello scheduler!',
};

const target = new targets.SnsPublish(topic, {
  input: ScheduleTargetInput.fromObject(payload),
});

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.hours(1)),
  target,
});
```

## Send events to an EventBridge event bus

Use the `EventBridgePutEvents` target to send events to an EventBridge event bus.

The code snippet below creates an event rule with an EventBridge event bus as a target
called every hour by Event Bridge Scheduler with a custom event payload.

```ts
import * as events from 'aws-cdk-lib/aws-events';

const eventBus = new events.EventBus(this, 'EventBus', {
  eventBusName: 'DomainEvents',
});

const eventEntry: targets.EventBridgePutEventsEntry = {
  eventBus,
  source: 'PetService',
  detail: ScheduleTargetInput.fromObject({ Name: 'Fluffy' }),
  detailType: '🐶',
};

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.hours(1)),
  target: new targets.EventBridgePutEvents(eventEntry, {}),
});
```

## Start an Amazon Inspector assessment run

Use the `InspectorStartAssessmentRun` target to start an Inspector assessment run.

The code snippet below creates an event rule with an assessment template as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as inspector from 'aws-cdk-lib/aws-inspector';

declare const assessmentTemplate: inspector.CfnAssessmentTemplate;

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.InspectorStartAssessmentRun(assessmentTemplate),
});
```

## Put a record to an Amazon Kinesis Data Streams

Use the `KinesisStreamPutRecord` target to put a record to an Amazon Kinesis Data Streams.

The code snippet below creates an event rule with a stream as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const stream = new kinesis.Stream(this, 'MyStream');

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.KinesisStreamPutRecord(stream, {
    partitionKey: 'key',
  }),
});
```

## Put a record to a Kinesis Data Firehose

Use the `KinesisDataFirehosePutRecord` target to put a record to a Kinesis Data Firehose delivery stream.

The code snippet below creates an event rule with a delivery stream as a target
called every hour by Event Bridge Scheduler with a custom payload.

```ts
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
declare const deliveryStream: firehose.CfnDeliveryStream;

const payload = {
  Data: "record",
};

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.KinesisDataFirehosePutRecord(deliveryStream, {
    input: ScheduleTargetInput.fromObject(payload),
  }),
});
```

## Start a CodePipeline execution

Use the `CodePipelineStartPipelineExecution` target to start a new execution for a CodePipeline pipeline.

The code snippet below creates an event rule with a CodePipeline pipeline as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';

declare const pipeline: codepipeline.Pipeline;

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.CodePipelineStartPipelineExecution(pipeline),
});
```

## Start a SageMaker pipeline execution

Use the `SageMakerStartPipelineExecution` target to start a new execution for a SageMaker pipeline.

The code snippet below creates an event rule with a SageMaker pipeline as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';

declare const pipeline: sagemaker.IPipeline;

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.SageMakerStartPipelineExecution(pipeline, {
    pipelineParameterList: [{
      name: 'parameter-name',
      value: 'parameter-value',
    }],
  }),
});
```
