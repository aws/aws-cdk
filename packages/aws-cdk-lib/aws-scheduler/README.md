# Amazon EventBridge Scheduler Construct Library

[Amazon EventBridge Scheduler](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-scheduler/) is a feature from Amazon EventBridge
that allows you to create, run, and manage scheduled tasks at scale. With EventBridge Scheduler, you can schedule millions of one-time or recurring tasks across various AWS services without provisioning or managing underlying infrastructure.

1. **Schedule**: A schedule is the main resource you create, configure, and manage using Amazon EventBridge Scheduler. Every schedule has a schedule expression that determines when, and with what frequency, the schedule runs. EventBridge Scheduler supports three types of schedules: rate, cron, and one-time schedules. When you create a schedule, you configure a target for the schedule to invoke.
2. **Target**: A target is an API operation that EventBridge Scheduler calls on your behalf every time your schedule runs. EventBridge Scheduler
supports two types of targets: templated targets and universal targets. Templated targets invoke common API operations across a core groups of
services. For example, EventBridge Scheduler supports templated targets for invoking AWS Lambda Function or starting execution of Step Functions state
machine. For API operations that are not supported by templated targets you can use customizable universal targets. Universal targets support calling
more than 6,000 API operations across over 270 AWS services.
3. **Schedule Group**: A schedule group is an Amazon EventBridge Scheduler resource that you use to organize your schedules. Your AWS account comes
with a default scheduler group. A new schedule will always be added to a scheduling group. If you do not provide a scheduling group to add to, it
will be added to the default scheduling group. You can create up to 500 schedule groups in your AWS account. Groups can be used to organize the
schedules logically, access the schedule metrics and manage permissions at group granularity (see details below). Schedule groups support tagging.
With EventBridge Scheduler, you apply tags to schedule groups, not to individual schedules to organize your resources.

## Defining a schedule

```ts
declare const fn: lambda.Function;

const target = new targets.LambdaInvoke(fn, {
    input: ScheduleTargetInput.fromObject({
        "payload": "useful",
    }),
});

const schedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    description: 'This is a test schedule that invokes a lambda function every 10 minutes.',
});
```

### Schedule Expressions

You can choose from three schedule types when configuring your schedule: rate-based, cron-based, and one-time schedules.

Both rate-based and cron-based schedules are recurring schedules. You can configure each recurring schedule type using a schedule expression.

For
cron-based schedules you can specify a time zone in which EventBridge Scheduler evaluates the expression.

```ts
declare const target: targets.LambdaInvoke;

const rateBasedSchedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    description: 'This is a test rate-based schedule',
});

const cronBasedSchedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.cron({ 
        minute: '0',
        hour: '23',
        day: '20',
        month: '11',
        timeZone: TimeZone.AMERICA_NEW_YORK,
    }),
    target,
    description: 'This is a test cron-based schedule that will run at 11:00 PM, on day 20 of the month, only in November in New York timezone',
});
```

A one-time schedule is a schedule that invokes a target only once. You configure a one-time schedule by specifying the time of day, date,
and time zone in which EventBridge Scheduler evaluates the schedule.

```ts
declare const target: targets.LambdaInvoke;

const oneTimeSchedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.at(
        new Date(2022, 10, 20, 19, 20, 23),
        TimeZone.AMERICA_NEW_YORK,
    ),
    target,
    description: 'This is a one-time schedule in New York timezone',
});
```

### Grouping Schedules

Your AWS account comes with a default scheduler group. You can access the default group in CDK with:

```ts
const defaultScheduleGroup = ScheduleGroup.fromDefaultScheduleGroup(this, "DefaultGroup");
```

You can add a schedule to a custom scheduling group managed by you. If a custom group is not specified, the schedule is added to the default group.

```ts
declare const target: targets.LambdaInvoke;

const scheduleGroup = new ScheduleGroup(this, "ScheduleGroup", {
    scheduleGroupName: "MyScheduleGroup",
});

new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    scheduleGroup,
});
```

### Disabling Schedules

By default, a schedule will be enabled. You can disable a schedule by setting the `enabled` property to false:

```ts
declare const target: targets.LambdaInvoke;

new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(10)),
    target: target,
    enabled: false,
});
```

### Configuring a start and end time of the Schedule

If you choose a recurring schedule, you can set the start and end time of the Schedule by specifying the `start` and `end`.

```ts
declare const target: targets.LambdaInvoke;

new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(cdk.Duration.hours(12)),
    target: target,
    start: new Date('2023-01-01T00:00:00.000Z'),
    end: new Date('2023-02-01T00:00:00.000Z'),
});
```

## Scheduler Targets

The `aws-cdk-lib/aws-scheduler-targets` module includes classes that implement the `IScheduleTarget` interface for
various AWS services. EventBridge Scheduler supports two types of targets:

1. **Templated targets** which invoke common API
operations across a core groups of services, and
2. **Universal targets** that you can customize to call more
than 6,000 operations across over 270 services.

A list of supported targets can be found at `aws-cdk-lib/aws-scheduler-targets`.

### Input

Targets can be invoked with a custom input. The `ScheduleTargetInput` class supports free-form text input and JSON-formatted object input:

```ts
const input = ScheduleTargetInput.fromObject({
    'QueueName': 'MyQueue'
});
```

You can include context attributes in your target payload. EventBridge Scheduler will replace each keyword with
its respective value and deliver it to the target. See
[full list of supported context attributes](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule-context-attributes.html):

1. `ContextAttribute.scheduleArn()` – The ARN of the schedule.
2. `ContextAttribute.scheduledTime()` – The time you specified for the schedule to invoke its target, e.g., 2022-03-22T18:59:43Z.
3. `ContextAttribute.executionId()` – The unique ID that EventBridge Scheduler assigns for each attempted invocation of a target, e.g., d32c5kddcf5bb8c3.
4. `ContextAttribute.attemptNumber()` – A counter that identifies the attempt number for the current invocation, e.g., 1.

```ts
const text = `Attempt number: ${ContextAttribute.attemptNumber}`;
const input = ScheduleTargetInput.fromText(text);
```

### Specifying an execution role

An execution role is an IAM role that EventBridge Scheduler assumes in order to interact with other AWS services on your behalf.

The classes for templated schedule targets automatically create an IAM role with all the minimum necessary
permissions to interact with the templated target. If you wish you may specify your own IAM role, then the templated targets
will grant minimal required permissions. For example, the `LambdaInvoke` target will grant the
IAM execution role `lambda:InvokeFunction` permission to invoke the Lambda function.

```ts
declare const fn: lambda.Function;

const role = new iam.Role(this, 'Role', {
    assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const target = new targets.LambdaInvoke(fn, {
    input: ScheduleTargetInput.fromObject({
        "payload": "useful"
    }),
    role,
});
```

### Specifying an encryption key

EventBridge Scheduler integrates with AWS Key Management Service (AWS KMS) to encrypt and decrypt your data using an AWS KMS key.
EventBridge Scheduler supports two types of KMS keys: AWS owned keys, and customer managed keys.

By default, all events in Scheduler are encrypted with a key that AWS owns and manages.
If you wish you can also provide a customer managed key to encrypt and decrypt the payload that your schedule delivers to its target using the `key` property.
Target classes will automatically add AWS `kms:Decrypt` permission to your schedule's execution role permissions policy.

```ts
declare const key: kms.Key;
declare const fn: lambda.Function;

const target = new targets.LambdaInvoke(fn, {
    input: ScheduleTargetInput.fromObject({
        payload: 'useful',
    }),
});

const schedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.minutes(10)),
    target,
    key,
});
```

> See [Data protection in Amazon EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/data-protection.html) for more details.

## Configuring flexible time windows

You can configure flexible time windows by specifying the `timeWindow` property.
Flexible time windows are disabled by default.

```ts
declare const target: targets.LambdaInvoke;

const schedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.hours(12)),
    target,
    timeWindow: TimeWindow.flexible(Duration.hours(10)),
});
```

> See [Configuring flexible time windows](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule-flexible-time-windows.html) for more details.

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
declare const fn: lambda.Function;

const dlq = new sqs.Queue(this, "DLQ", {
    queueName: 'MyDLQ',
});

const target = new targets.LambdaInvoke(fn, {
    deadLetterQueue: dlq,
    maxEventAge: Duration.minutes(1),
    retryAttempts: 3
});
```

## Monitoring

You can monitor Amazon EventBridge Scheduler using CloudWatch, which collects raw data
and processes it into readable, near real-time metrics. EventBridge Scheduler emits
a set of metrics for all schedules, and an additional set of metrics for schedules that
have an associated dead-letter queue (DLQ). If you configure a DLQ for your schedule,
EventBridge Scheduler publishes additional metrics when your schedule exhausts its retry policy.

### Metrics for all schedules

The `Schedule` class provides static methods for accessing all schedules metrics with default configuration, such as `metricAllErrors` for viewing errors when executing targets.

 ```ts
new cloudwatch.Alarm(this, 'SchedulesErrorAlarm', {
    metric: Schedule.metricAllErrors(),
    threshold: 0,
    evaluationPeriods: 1,
});
 ```

### Metrics for a Schedule Group

To view metrics for a specific group you can use methods on class `ScheduleGroup`:

```ts
const scheduleGroup = new ScheduleGroup(this, "ScheduleGroup", {
    scheduleGroupName: "MyScheduleGroup",
});

new cloudwatch.Alarm(this, 'MyGroupErrorAlarm', {
    metric: scheduleGroup.metricTargetErrors(),
    evaluationPeriods: 1,
    threshold: 0
});

// Or use default group
const defaultScheduleGroup = ScheduleGroup.fromDefaultScheduleGroup(this, "DefaultScheduleGroup");
new cloudwatch.Alarm(this, 'DefaultScheduleGroupErrorAlarm', {
    metric: defaultScheduleGroup.metricTargetErrors(),
    evaluationPeriods: 1,
    threshold: 0
});
```

See full list of metrics and their description at
[Monitoring Using CloudWatch Metrics](https://docs.aws.amazon.com/scheduler/latest/UserGuide/monitoring-cloudwatch.html)
in the *AWS EventBridge Scheduler User Guide*.
