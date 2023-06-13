# AWS Auto Scaling Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

**Application AutoScaling** is used to configure autoscaling for all
services other than scaling EC2 instances. For example, you will use this to
scale ECS tasks, DynamoDB capacity, Spot Fleet sizes, Comprehend document classification endpoints, Lambda function provisioned concurrency and more.

As a CDK user, you will probably not have to interact with this library
directly; instead, it will be used by other construct libraries to
offer AutoScaling features for their own constructs.

This document will describe the general autoscaling features and concepts;
your particular service may offer only a subset of these.

## AutoScaling basics

Resources can offer one or more **attributes** to autoscale, typically
representing some capacity dimension of the underlying service. For example,
a DynamoDB Table offers autoscaling of the read and write capacity of the
table proper and its Global Secondary Indexes, an ECS Service offers
autoscaling of its task count, an RDS Aurora cluster offers scaling of its
replica count, and so on.

When you enable autoscaling for an attribute, you specify a minimum and a
maximum value for the capacity. AutoScaling policies that respond to metrics
will never go higher or lower than the indicated capacity (but scheduled
scaling actions might, see below).

There are three ways to scale your capacity:

* **In response to a metric** (also known as step scaling); for example, you
  might want to scale out if the CPU usage across your cluster starts to rise,
  and scale in when it drops again.
* **By trying to keep a certain metric around a given value** (also known as
  target tracking scaling); you might want to automatically scale out an in to
  keep your CPU usage around 50%.
* **On a schedule**; you might want to organize your scaling around traffic
  flows you expect, by scaling out in the morning and scaling in in the
  evening.

The general pattern of autoscaling will look like this:

```ts
declare const resource: SomeScalableResource;

const capacity = resource.autoScaleCapacity({
  minCapacity: 5,
  maxCapacity: 100
});

// Then call a method to enable metric scaling and/or schedule scaling
// (explained below):
//
// capacity.scaleOnMetric(...);
// capacity.scaleToTrackMetric(...);
// capacity.scaleOnSchedule(...);
```

## Step Scaling

This type of scaling scales in and out in deterministic steps that you
configure, in response to metric values. For example, your scaling strategy
to scale in response to CPU usage might look like this:

```plaintext
 Scaling        -1          (no change)          +1       +3
            │        │                       │        │        │
            ├────────┼───────────────────────┼────────┼────────┤
            │        │                       │        │        │
CPU usage   0%      10%                     50%       70%     100%
```

(Note that this is not necessarily a recommended scaling strategy, but it's
a possible one. You will have to determine what thresholds are right for you).

You would configure it like this:

```ts
declare const capacity: ScalableAttribute;
declare const cpuUtilization: cloudwatch.Metric;

capacity.scaleOnMetric('ScaleToCPU', {
  metric: cpuUtilization,
  scalingSteps: [
    { upper: 10, change: -1 },
    { lower: 50, change: +1 },
    { lower: 70, change: +3 },
  ],

  // Change this to AdjustmentType.PercentChangeInCapacity to interpret the
  // 'change' numbers before as percentages instead of capacity counts.
  adjustmentType: appscaling.AdjustmentType.CHANGE_IN_CAPACITY,
});
```

The AutoScaling construct library will create the required CloudWatch alarms and
AutoScaling policies for you.

### Scaling based on multiple datapoints

The Step Scaling configuration above will initiate a scaling event when a single
datapoint of the scaling metric is breaching a scaling step breakpoint. In cases
where you might want to initiate scaling actions on a larger number of datapoints
(ie in order to smooth out randomness in the metric data), you can use the
optional `evaluationPeriods` and `datapointsToAlarm` properties:

```ts
declare const capacity: ScalableAttribute;
declare const cpuUtilization: cloudwatch.Metric;

capacity.scaleOnMetric('ScaleToCPUWithMultipleDatapoints', {
  metric: cpuUtilization,
  scalingSteps: [
    { upper: 10, change: -1 },
    { lower: 50, change: +1 },
    { lower: 70, change: +3 },
  ],

  // if the cpuUtilization metric has a period of 1 minute, then data points
  // in the last 10 minutes will be evaluated
  evaluationPeriods: 10,

  // Only trigger a scaling action when 6 datapoints out of the last 10 are
  // breaching. If this is left unspecified, then ALL datapoints in the 
  // evaluation period must be breaching to trigger a scaling action
  datapointsToAlarm: 6
});
```

## Target Tracking Scaling

This type of scaling scales in and out in order to keep a metric (typically
representing utilization) around a value you prefer. This type of scaling is
typically heavily service-dependent in what metric you can use, and so
different services will have different methods here to set up target tracking
scaling.

The following example configures the read capacity of a DynamoDB table
to be around 60% utilization:

```ts
import * as dynamodb from '@aws-cdk/aws-dynamodb';

declare const table: dynamodb.Table;

const readCapacity = table.autoScaleReadCapacity({
  minCapacity: 10,
  maxCapacity: 1000
});
readCapacity.scaleOnUtilization({
  targetUtilizationPercent: 60
});
```

## Scheduled Scaling

This type of scaling is used to change capacities based on time. It works
by changing the `minCapacity` and `maxCapacity` of the attribute, and so
can be used for two purposes:

* Scale in and out on a schedule by setting the `minCapacity` high or
  the `maxCapacity` low.
* Still allow the regular scaling actions to do their job, but restrict
  the range they can scale over (by setting both `minCapacity` and
  `maxCapacity` but changing their range over time).

The following schedule expressions can be used:

* `at(yyyy-mm-ddThh:mm:ss)` -- scale at a particular moment in time
* `rate(value unit)` -- scale every minute/hour/day
* `cron(mm hh dd mm dow)` -- scale on arbitrary schedules

Of these, the cron expression is the most useful but also the most
complicated. A schedule is expressed as a cron expression. The `Schedule` class has a `cron` method to help build cron expressions.

The following example scales the fleet out in the morning, and lets natural
scaling take over at night:

```ts
declare const resource: SomeScalableResource;

const capacity = resource.autoScaleCapacity({
  minCapacity: 1,
  maxCapacity: 50,
});

capacity.scaleOnSchedule('PrescaleInTheMorning', {
  schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 20,
});

capacity.scaleOnSchedule('AllowDownscalingAtNight', {
  schedule: appscaling.Schedule.cron({ hour: '20', minute: '0' }),
  minCapacity: 1
});
```

## Examples

### Lambda Provisioned Concurrency Auto Scaling

```ts
import * as lambda from '@aws-cdk/aws-lambda';

declare const code: lambda.Code;

const handler = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.PYTHON_3_7,
  handler: 'index.handler',
  code,

  reservedConcurrentExecutions: 2,
});

const fnVer = handler.currentVersion;

const target = new appscaling.ScalableTarget(this, 'ScalableTarget', {
  serviceNamespace: appscaling.ServiceNamespace.LAMBDA,
  maxCapacity: 100,
  minCapacity: 10,
  resourceId: `function:${handler.functionName}:${fnVer.version}`,
  scalableDimension: 'lambda:function:ProvisionedConcurrency',
})

target.scaleToTrackMetric('PceTracking', {
  targetValue: 0.9,
  predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
})
```

### ElastiCache Redis shards scaling with target value

```ts
const shardsScalableTarget = new appscaling.ScalableTarget(this, 'ElastiCacheRedisShardsScalableTarget', {
  serviceNamespace: appscaling.ServiceNamespace.ELASTICACHE,
  scalableDimension: 'elasticache:replication-group:NodeGroups',
  minCapacity: 2,
  maxCapacity: 10,
  resourceId: 'replication-group/main-cluster',
});

shardsScalableTarget.scaleToTrackMetric('ElastiCacheRedisShardsCPUUtilization', {
  targetValue: 20,
  predefinedMetric: appscaling.PredefinedMetric.ELASTICACHE_PRIMARY_ENGINE_CPU_UTILIZATION,
});
```
