## Amazon EC2 Auto Scaling Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Fleet

### Auto Scaling Group

An `AutoScalingGroup` represents a number of instances on which you run your code. You
pick the size of the fleet, the instance type and the OS image:

```ts
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage() // get the latest Amazon Linux image
});
```

> NOTE: AutoScalingGroup has an property called `allowAllOutbound` (allowing the instances to contact the
> internet) which is set to `true` by default. Be sure to set this to `false`  if you don't want
> your instances to be able to start arbitrary connections.

### Machine Images (AMIs)

AMIs control the OS that gets launched when you start your EC2 instance. The EC2
library contains constructs to select the AMI you want to use.

Depending on the type of AMI, you select it a different way.

The latest version of Amazon Linux and Microsoft Windows images are
selectable by instantiating one of these classes:

[example of creating images](test/example.images.lit.ts)

> NOTE: The Amazon Linux images selected will be cached in your `cdk.json`, so that your
> AutoScalingGroups don't automatically change out from under you when you're making unrelated
> changes. To update to the latest version of Amazon Linux, remove the cache entry from the `context`
> section of your `cdk.json`.
>
> We will add command-line options to make this step easier in the future.

### AutoScaling Instance Counts

AutoScalingGroups make it possible to raise and lower the number of instances in the group,
in response to (or in advance of) changes in workload.

When you create your AutoScalingGroup, you specify a `minCapacity` and a
`maxCapacity`. AutoScaling policies that respond to metrics will never go higher
or lower than the indicated capacity (but scheduled scaling actions might, see
below).

There are three ways to scale your capacity:

* **In response to a metric** (also known as step scaling); for example, you
  might want to scale out if the CPU usage across your cluster starts to rise,
  and scale in when it drops again.
* **By trying to keep a certain metric around a given value** (also known as
  target tracking scaling); you might want to automatically scale out and in to
  keep your CPU usage around 50%.
* **On a schedule**; you might want to organize your scaling around traffic
  flows you expect, by scaling out in the morning and scaling in in the
  evening.

The general pattern of autoscaling will look like this:

```ts
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  minCapacity: 5,
  maxCapacity: 100
  // ...
});

// Step scaling
autoScalingGroup.scaleOnMetric(...);

// Target tracking scaling
autoScalingGroup.scaleOnCpuUtilization(...);
autoScalingGroup.scaleOnIncomingBytes(...);
autoScalingGroup.scaleOnOutgoingBytes(...);
autoScalingGroup.scaleOnRequestCount(...);
autoScalingGroup.scaleToTrackMetric(...);

// Scheduled scaling
autoScalingGroup.scaleOnSchedule(...);
```

#### Step Scaling

This type of scaling scales in and out in deterministics steps that you
configure, in response to metric values. For example, your scaling strategy to
scale in response to a metric that represents your average worker pool usage
might look like this:

```
 Scaling        -1          (no change)          +1       +3
            │        │                       │        │        │
            ├────────┼───────────────────────┼────────┼────────┤
            │        │                       │        │        │
Worker use  0%      10%                     50%       70%     100%
```

(Note that this is not necessarily a recommended scaling strategy, but it's
a possible one. You will have to determine what thresholds are right for you).

Note that in order to set up this scaling strategy, you will have to emit a
metric representing your worker utilization from your instances. After that,
you would configure the scaling something like this:

```ts
const workerUtilizationMetric = new cloudwatch.Metric({
    namespace: 'MyService',
    metricName: 'WorkerUtilization'
});

capacity.scaleOnMetric('ScaleToCPU', {
  metric: workerUtilizationMetric,
  scalingSteps: [
    { upper: 10, change: -1 },
    { lower: 50, change: +1 },
    { lower: 70, change: +3 },
  ],

  // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
  // 'change' numbers before as percentages instead of capacity counts.
  adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
});
```

The AutoScaling construct library will create the required CloudWatch alarms and
AutoScaling policies for you.

#### Target Tracking Scaling

This type of scaling scales in and out in order to keep a metric around a value
you prefer. There are four types of predefined metrics you can track, or you can
choose to track a custom metric. If you do choose to track a custom metric,
be aware that the metric has to represent instance utilization in some way
(AutoScaling will scale out if the metric is higher than the target, and scale
in if the metric is lower than the target).

If you configure multiple target tracking policies, AutoScaling will use the
one that yields the highest capacity.

The following example scales to keep the CPU usage of your instances around
50% utilization:

```ts
autoScalingGroup.scaleOnCpuUtilization('KeepSpareCPU', {
  targetUtilizationPercent: 50
});
```

To scale on average network traffic in and out of your instances:

```ts
autoScalingGroup.scaleOnIncomingBytes('LimitIngressPerInstance', {
    targetBytesPerSecond: 10 * 1024 * 1024 // 10 MB/s
});
autoScalingGroup.scaleOnOutcomingBytes('LimitEgressPerInstance', {
    targetBytesPerSecond: 10 * 1024 * 1024 // 10 MB/s
});
```

To scale on the average request count per instance (only works for
AutoScalingGroups that have been attached to Application Load
Balancers):

```ts
autoScalingGroup.scaleOnRequestCount('LimitRPS', {
    targetRequestsPerSecond: 1000
});
```

#### Scheduled Scaling

This type of scaling is used to change capacities based on time. It works by
changing `minCapacity`, `maxCapacity` and `desiredCapacity` of the
AutoScalingGroup, and so can be used for two purposes:

* Scale in and out on a schedule by setting the `minCapacity` high or
  the `maxCapacity` low.
* Still allow the regular scaling actions to do their job, but restrict
  the range they can scale over (by setting both `minCapacity` and
  `maxCapacity` but changing their range over time).

A schedule is expressed as a cron expression. The `Schedule` class has a `cron` method to help build cron expressions.

The following example scales the fleet out in the morning, going back to natural
scaling (all the way down to 1 instance if necessary) at night:

```ts
autoScalingGroup.scaleOnSchedule('PrescaleInTheMorning', {
  schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 20,
});

autoScalingGroup.scaleOnSchedule('AllowDownscalingAtNight', {
  schedule: autoscaling.Schedule.cron({ hour: '20', minute: '0' }),
  minCapacity: 1
});
```

### Allowing Connections

See the documentation of the `@aws-cdk/aws-ec2` package for more information
about allowing connections between resources backed by instances.

### Future work

- [ ] CloudWatch Events (impossible to add currently as the AutoScalingGroup ARN is
  necessary to make this rule and this cannot be accessed from CloudFormation).
