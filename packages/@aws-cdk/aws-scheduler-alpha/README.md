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

1. **Schedule**: A schedule is the main resource you create, configure, and manage using Amazon EventBridge Scheduler. Every schedule has a schedule expression that determines when, and with what frequency, the schedule runs. EventBridge Scheduler supports three types of schedules: rate, cron, and one-time schedules. When you create a schedule, you configure a target for the schedule to invoke. 
2. **Targets**: A target is an API operation that EventBridge Scheduler calls on your behalf every time your schedule runs. EventBridge Scheduler
supports two types of targets: templated targets and universal targets. Templated targets invoke common API operations across a core groups of 
services. For example, EventBridge Scheduler supports templated targets for invoking AWS Lambda Function or starting execution of Step Function state
machine. For API operations that are not supported by templated targets you can use customizeable universal targets. Universal targets support calling
more than 6,000 API operations across over 270 AWS services.
3. **Schedule Group**: A schedule group is an Amazon EventBridge Scheduler resource that you use to organize your schedules. Your AWS account comes
with a default scheduler group. A new schedule will always be added to a scheduling group. If you do not provide a scheduling group to add to, it 
will be added to the default scheduling group. You can create up to 500 schedule groups in your AWS account. Groups can be used to organize the 
schedules logically, access the schedule metrics and manage permissions at group granularity (see details below). Scheduling groups support tagging:
with EventBridge Scheduler, you apply tags to schedule groups, not to individual schedules to organize your resources.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project. It allows you to define Event Bridge Schedules.

> This module is in active development. Some features may not be implemented yet.

## Defining a schedule 

TODO: Schedule is not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

### Schedule Expressions

You can choose from three schedule types when configuring your schedule: rate-based, cron-based, and one-time schedules. 

Both rate-based and cron-based schedules are recurring schedules. You can configure each recurring schedule type using a schedule expression. For 
cron-based schedule you can specify a time zone in which EventBridge Scheduler evaluates the expression. 


> ScheduleExpression should be used together with class Schedule, which is not yet implemented.

[comment]: <> (TODO: Switch to `ts` once Schedule is implemented)

```text
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
        timeZone: TimeZone.AMERICA_NEW_YORK,
    }),
    target,
    description: 'This is a test cron-based schedule that will run at 11:00 PM, on day 20 of the month, only in November in New York timezone',
});
```

A one-time schedule is a schedule that invokes a target only once. You configure a one-time schedule when by specifying the time of the day, date, 
and time zone in which EventBridge Scheduler evaluates the schedule.

[comment]: <> (TODO: Switch to `ts` once Schedule is implemented)

```text
const oneTimeSchedule = new Schedule(this, 'Schedule', {
    scheduleExpression: ScheduleExpression.at(
        new Date(2022, 10, 20, 19, 20, 23),
        TimeZone.AMERICA_NEW_YORK,
    ),
    target,
    description: 'This is a one-time schedule in New York timezone',
});
```

### Grouping Schedules

TODO: Group is not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

## Scheduler Targets

TODO: Scheduler Targets Module is not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

### Input 

TODO: Target Input is not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)


### Specifying Execution Role 

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

### Cross-account and cross-region targets

Executing cross-account and cross-region targets are not supported yet.

### Specifying Encryption key

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

## Error-handling 

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

## Overriding Target Properties 

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)


## Monitoring

You can monitor Amazon EventBridge Scheduler using CloudWatch, which collects raw data 
and processes it into readable, near real-time metrics. EventBridge Scheduler emits 
a set of metrics for all schedules, and an additional set of metrics for schedules that
have an associated dead-letter queue (DLQ). If you configure a DLQ for your schedule, 
EventBridge Scheduler publishes additional metrics when your schedule exhausts its retry policy.

### Metrics for all schedules

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)

### Metrics for a Group

TODO: Not yet implemented. See section in [L2 Event Bridge Scheduler RFC](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0474-event-bridge-scheduler-l2.md)
