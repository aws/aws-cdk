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

[Amazon EventBridge Scheduler](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-scheduler/) is a feature from Amazon EventBridge that allows you to create, run, and manage scheduled tasks at scale. With EventBridge Scheduler, you can schedule one-time or recurrently tens of millions of tasks across many AWS services without provisioning or managing underlying infrastructure.

1. **Schedule**: A schedule is the main resource you create, configure, and manage using Amazon EventBridge Scheduler. Every schedule has a schedule expression that determines when, and with what frequency, the schedule runs. EventBridge Scheduler supports three types of schedules: rate, cron, and one-time schedules. When you create a schedule, you configure a target for the schedule to invoke. 
2. **Targets**: A target is an API operation that EventBridge Scheduler calls on your behalf every time your schedule runs. EventBridge Scheduler supports two types of targets: templated targets and universal targets. Templated targets invoke common API operations across a core groups of services. For example, EventBridge Scheduler supports templated targets for invoking AWS Lambda Function or starting execution of Step Function state machine. For API operations that are not supported by templated targets you can use customizeable universal targets. Universal targets support calling more than 6,000 API operations across over 270 AWS services.
3. **Schedule Group**: A schedule group is an Amazon EventBridge Scheduler resource that you use to organize your schedules. Your AWS account comes with a default scheduler group. A new schedule will always be added to a scheduling group. If you do not provide a scheduling group to add to, it will be added to the default scheduling group. You can create up to 500 schedule groups in your AWS account. Groups can be used to organize the schedules logically, access the schedule metrics and manage permissions at group granularity (see details below). Scheduling groups support tagging: with EventBridge Scheduler, you apply tags to schedule groups, not to individual schedules to organize your resources.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project. It allows you to define Event Bridge Schedules.


## Defining a schedule 

```ts
const target = new targets.LambdaInvoke(props.func, {
    input: ScheduleTargetInput.fromObject({
        "payload": "useful"
    })
});
    
const schedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    description: 'This is a test schedule that invokes lambda function every 10 minutes.',
});
```

### Schedule Expressions

You can choose from three schedule types when configuring your schedule: rate-based, cron-based, and one-time schedules. 

Both rate-based and cron-based schedules are recurring schedules. You can configure each recurring schedule type using a schedule expression. For cron-based schedule you can specify a time zone in which EventBridge Scheduler evaluates the expression. 

```ts
const rateBasedSchedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    description: 'This is a test rate-based schedule',
});

const cronBasedSchedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.cron({ 
        minute: '0',
        hour: '23',
        day: '20',
        month: '11',
        timeZone: TimeZone.AMERICA_NEW_YORK 
    }),
    target,
    description: 'This is a test cron-based schedule that will run at 11:00 PM, on day 20 of the month, only in November in New York timezone',
});
```

A one-time schedule is a schedule that invokes a target only once. You configure a one-time schedule when by specifying the time of the day, date, and time zone in which EventBridge Scheduler evaluates the schedule.

```ts
const oneTimeSchedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.at(
        new Date(2022, 10, 20, 19, 20, 23)
        TimeZone.AMERICA_NEW_YORK
    )
    target,
    description: 'This is a one-time schedule in New York timezone',
});
```

### Grouping Schedules

Your AWS account comes with a default scheduler group, which you can access in CDK with: 

```ts
const defaultGroup = Group.fromDefaultGroup(this, "DefaultGroup");
```

When creating a new schedule, you can also add the schedule to a custom scheduling group managed by you:

```ts
const group = new Group(this, "Group", {
    groupName: "MyGroup"
});

const target = new targets.LambdaInvoke(props.func, {
    input: ScheduleTargetInput.fromObject({
        "payload": "useful"
    })
});
    
const schedule1 = new Schedule(this, 'Schedule1', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(10)),
    target
});

const schedule2 = new Schedule(this, 'Schedule2', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(5)),
    target
});

group.addSchedules(schedule1, schedule2);

// You can also assign groups in a schedule constructor: 
const schedule3 = new Schedule(this, 'Schedule2', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(5)),
    group,
    target
});
```

## Scheduler Targets

The `@aws-cdk/aws-schedule-targets` module includes classes that implement the `IScheduleTarget` interface for various AWS services. EventBridge Scheduler supports two types of targets: templated targets invoke common API operations across a core groups of services, and customizeable universal targets that you can use to call more than 6,000 operations across over 270 services.

Templated targets are a set of common API operations across a group of core AWS services such as Amazon SQS, Lambda, and Step Functions. The module contains CDK constructs for templated targets. For example, you can use construct `targets.LambdaInvoke` to target Lambda's Invoke API operation by providing a `lambda.IFunction`, or use `targets.SqsSendMessage` with a `sqs.IQueue` to send a message to SQS queue. 


The following templated targets are supported:

1. `targets.CodeBuildStartBuild`: Start an AWS CodeBuild build
1. `targets.CodePipelineStartPipelineExecution`: Start an AWS CodePipeline pipeline execution
1. `targets.StepFunctionsStartExecution`: Trigger an AWS Step Functions state machine
1. `targets.KinesisDataFirehosePutRecord`: Put a record to a Kinesis Firehose
1. `targets.KinesisStreamPutRecord`: Put a record to a Kinesis Stream
1. `targets.InspectorStartAssessmentRun`: Start an AWS Inspector assessment run
1. `targets.EventBridgePutEvents`: Put an event to an AWS Event Bridge Event Bus
1. `targets.EcsTask`: Start a task on an Amazon ECS cluster
1. `targets.SageMakerStartPipelineExecution`: Start Amazon SageMaker pipeline
1. `targets.LambdaInvoke`: Invoke an AWS Lambda function
1. `targets.SqsSendMessage`: Send a message to an Amazon SQS Queue
1. `targets.SnsPublish`: Publish a message into an SNS topic


A universal target is a customizable set of parameters that allow you to invoke a wider set of API operation for many AWS services. To create a universal target you need to specify `input`, service name and service action. See [full list of support universal targets](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets-universal.html#supported-universal-targets).

For example, to create a schedule that will create a SQS queue every hour:

```ts
const input = ScheduleTargetInput.fromObject({
    'QueueName': 'MyQueue'
});

const schedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.rate(Duration.hours(1)),
    target: new targets.Universal('sqs', 'CreateQueue', { input: input })
});
```

### Input 

Target can be invoked with a custom input. Class `ScheduleTargetInput` supports free form text input and JSON-formatted object input:

```ts
const input = ScheduleTargetInput.fromObject({
    'QueueName': 'MyQueue'
});
```

You can include context attributes in your target payload. EventBridge Scheduler will replace each keyword with its respective value and deliver it to the target. See [full list of supported context attributes](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule-context-attributes.html): 

1. `ContextAttribute.scheduleArn()` – The ARN of the schedule.
2. `ContextAttribute.scheduledTime()` – The time you specified for the schedule to invoke its target, for example, 2022-03-22T18:59:43Z.
3. `ContextAttribute.executionId()` – The unique ID that EventBridge Scheduler assigns for each attempted invocation of a target, for example, d32c5kddcf5bb8c3.
4. `ContextAttribute.attemptNumber()` – A counter that identifies the attempt number for the current invocation, for example, 1.

```ts
const text = `Attempt number: ${ContextAttribute.attemptNumber}`;
const input = scheduler.ScheduleTargetInput.fromInput(text);
```


### Specifying Execution Role 

An execution role is an IAM role that EventBridge Scheduler assumes in order to interact with other AWS services on your behalf.

The classes for templated schedule targets automatically create an IAM role with all the minimum necessary
permissions to interact with the templated target. If you wish you may specify your own IAM role, then the templated targets 
will grant minimal required permissions. For example: for invoking Lambda function target `LambdaInvoke` will grant
execution IAM role permission to `lambda:InvokeFunction`.

```ts
import * as iam from '@aws-cdk/aws-iam';

declare const fn: lambda.Function;

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const target = new targets.LambdaInvoke({
    input: ScheduleTargetInput.fromObject({ 
        "payload": "useful"
    }),
    role,
}, fn);
```

Universal target automatically create an IAM role if you do not specify your own IAM role. However, in comparison with templated targets, for universal targets you must grant the required IAM permissions yourself.

```ts
const input = ScheduleTargetInput.fromObject({
    'QueueName': 'MyQueue'
});

const target = new targets.Universal('sqs', 'CreateQueue', { input: input });

target.role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: '*',
    actions: ['sqs:CreateQueue']
}));

const schedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.rate(Duration.hours(1)),
    target
});
```

### Cross-account and cross-region targets

Executing cross-account and cross-region targets are not supported yet.

### Specifying Encryption key

EventBridge Scheduler integrates with AWS Key Management Service (AWS KMS) to encrypt and decrypt your data using an AWS KMS key. EventBridge Scheduler supports two types of KMS keys: AWS owned keys, and customer managed keys. 

By default, all events in Scheduler are encrypted with a key that AWS owns and manages. 
If you wish you can also provide a customer managed key to encrypt and decrypt the payload that your schedule delivers 
to its target. Target classes will automatically add AWS KMS Decrypt permission to your schedule's execution role
permissions policy

```ts
import * as kms from '@aws-cdk/aws-kms';

const key = new kms.Key(this, 'Key');

const schedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    key: key,
});
```

See: [Data Protection](https://docs.aws.amazon.com/scheduler/latest/UserGuide/data-protection.html) in
the *Amazon EventBridge Scheduler User Guide*.

## Error-handling 

You can configure how your schedule handles failures, when EventBridge Scheduler is unable to deliver an event
successfully to a target, by using two primary mechanisms: a retry policy, and a dead-letter queue (DLQ). 

A retry policy determines the number of times EventBridge Scheduler must retry a failed event, and how long 
to keep an unprocessed event. 

A DLQ is a standard Amazon SQS queue EventBridge Scheduler uses to deliver failed events to, after the retry 
policy has been exhausted. You can use a DLQ to troubleshoot issues with your schedule or its downstream target. 
If you've configured a retry policy for your schedule, EventBridge Scheduler delivers the dead-letter event after
exhausting the maximum number of retries you set in the retry policy.

```ts
const dlq = new Queue(this, "DLQ", {
      queueName: 'MyDLQ',
});

const target = new targets.LambdaInvoke(props.func, {
    deadLetterQueue: dlq,
    maximumEventAge: Duration.minutes(1),
    maximumRetryAttempts: 3
});
```

## Overriding Target Properties 

If you wish to reuse the same target in multiple schedules, you can override target properties 
like `input`, `maximumRetryAttempts` and `maximumEventAge` when creating a Schedule:

```ts
const target = new targets.LambdaInvoke(props.func, {
    input: ScheduleTargetInput.fromObject({
        "payload": "useful"
    }),
});
    
const schedule1 = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.cron({ day: '20' }),
    target,
});

const schedule2 = new Schedule(this, 'Schedule2', {
    scheduleExpression: ScheduleExpression.cron({ day: '5' })
    target,
    targetOverrides: {
        input: ScheduleTargetInput.fromText("Overriding Target Input") 
    }
});
```

## Monitoring

You can monitor Amazon EventBridge Scheduler using CloudWatch, which collects raw data 
and processes it into readable, near real-time metrics. EventBridge Scheduler emits 
a set of metrics for all schedules, and an additional set of metrics for schedules that
have an associated dead-letter queue (DLQ). If you configure a DLQ for your schedule, 
EventBridge Scheduler publishes additional metrics when your schedule exhausts its retry policy.

### Metrics for all schedules

Class `Schedule` provides static methods for accessing all schedules metrics with default configuration, 
such as `metricAllErrors` for viewing errors when executing targets. 

```ts 

import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

new Alarm(this, 'SchedulesErrorAlarm', {
  metric: Schedule.metricAllErrors(),
  threshold: 0
});
```

### Metrics for a Group

To view metrics for a specific group you can use methods on class `Group`:

```ts
const group = new Group(this, "Group", {
    groupName: "MyGroup"
});

new Alarm(this, 'MyGroupErrorAlarm', {
  metric: group.metricAllErrors(),
  threshold: 0
});
```

See full list of metrics and their description at [Monitoring Using CloudWatch Metrics](https://docs.aws.amazon.com/scheduler/latest/UserGuide/monitoring-cloudwatch.html) in the *AWS Event Bridge Scheduler User Guide*.
