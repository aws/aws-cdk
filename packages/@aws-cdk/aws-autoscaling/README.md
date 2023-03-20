# Amazon EC2 Auto Scaling Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Auto Scaling Group

An `AutoScalingGroup` represents a number of instances on which you run your code. You
pick the size of the fleet, the instance type and the OS image:

```ts
declare const vpc: ec2.Vpc;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),

  // The latest Amazon Linux image of a particular generation
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
});
```

NOTE: AutoScalingGroup has an property called `allowAllOutbound` (allowing the instances to contact the
internet) which is set to `true` by default. Be sure to set this to `false`  if you don't want
your instances to be able to start arbitrary connections. Alternatively, you can specify an existing security
group to attach to the instances that are launched, rather than have the group create a new one.

```ts
declare const vpc: ec2.Vpc;

const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });
new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  securityGroup: mySecurityGroup,
});
```

Alternatively you can create an `AutoScalingGroup` from a `LaunchTemplate`:

```ts
declare const vpc: ec2.Vpc;
declare const launchTemplate: ec2.LaunchTemplate;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  launchTemplate: launchTemplate
});
```

To launch a mixture of Spot and on-demand instances, and/or with multiple instance types, you can create an `AutoScalingGroup` from a MixedInstancesPolicy:

```ts
declare const vpc: ec2.Vpc;
declare const launchTemplate1: ec2.LaunchTemplate;
declare const launchTemplate2: ec2.LaunchTemplate;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  mixedInstancesPolicy: {
    instancesDistribution: {
      onDemandPercentageAboveBaseCapacity: 50, // Mix Spot and On-Demand instances
    },
    launchTemplate: launchTemplate1,
    launchTemplateOverrides: [ // Mix multiple instance types
      { instanceType: new ec2.InstanceType('t3.micro') },
      { instanceType: new ec2.InstanceType('t3a.micro') },
      { instanceType: new ec2.InstanceType('t4g.micro'), launchTemplate: launchTemplate2 },
    ],
  }
});
```

## Machine Images (AMIs)

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

## AutoScaling Instance Counts

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
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  minCapacity: 5,
  maxCapacity: 100
  // ...
});

// Then call one of the scaling methods (explained below)
//
// autoScalingGroup.scaleOnMetric(...);
//
// autoScalingGroup.scaleOnCpuUtilization(...);
// autoScalingGroup.scaleOnIncomingBytes(...);
// autoScalingGroup.scaleOnOutgoingBytes(...);
// autoScalingGroup.scaleOnRequestCount(...);
// autoScalingGroup.scaleToTrackMetric(...);
//
// autoScalingGroup.scaleOnSchedule(...);
```

### Step Scaling

This type of scaling scales in and out in deterministics steps that you
configure, in response to metric values. For example, your scaling strategy to
scale in response to a metric that represents your average worker pool usage
might look like this:

```plaintext
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
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

const workerUtilizationMetric = new cloudwatch.Metric({
    namespace: 'MyService',
    metricName: 'WorkerUtilization'
});

autoScalingGroup.scaleOnMetric('ScaleToCPU', {
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

### Target Tracking Scaling

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
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.scaleOnCpuUtilization('KeepSpareCPU', {
  targetUtilizationPercent: 50
});
```

To scale on average network traffic in and out of your instances:

```ts
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.scaleOnIncomingBytes('LimitIngressPerInstance', {
    targetBytesPerSecond: 10 * 1024 * 1024 // 10 MB/s
});
autoScalingGroup.scaleOnOutgoingBytes('LimitEgressPerInstance', {
    targetBytesPerSecond: 10 * 1024 * 1024 // 10 MB/s
});
```

To scale on the average request count per instance (only works for
AutoScalingGroups that have been attached to Application Load
Balancers):

```ts
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.scaleOnRequestCount('LimitRPS', {
    targetRequestsPerSecond: 1000
});
```

### Scheduled Scaling

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
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.scaleOnSchedule('PrescaleInTheMorning', {
  schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 20,
});

autoScalingGroup.scaleOnSchedule('AllowDownscalingAtNight', {
  schedule: autoscaling.Schedule.cron({ hour: '20', minute: '0' }),
  minCapacity: 1
});
```

### Block Devices

This type specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.

#### GP3 Volumes

You can only specify the `throughput` on GP3 volumes.

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,
  blockDevices: [
    {
        deviceName: 'gp3-volume',
        volume: autoscaling.BlockDeviceVolume.ebs(15, {
          volumeType: autoscaling.EbsDeviceVolumeType.GP3,
          throughput: 125,
        }),
      },
  ],
  // ...
});
```

## Configuring Instances using CloudFormation Init

It is possible to use the CloudFormation Init mechanism to configure the
instances in the AutoScalingGroup. You can write files to it, run commands,
start services, etc. See the documentation of
[AWS::CloudFormation::Init](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-init.html)
and the documentation of CDK's `aws-ec2` library for more information.

When you specify a CloudFormation Init configuration for an AutoScalingGroup:

* you *must* also specify `signals` to configure how long CloudFormation
  should wait for the instances to successfully configure themselves.
* you *should* also specify an `updatePolicy` to configure how instances
  should be updated when the AutoScalingGroup is updated (for example,
  when the AMI is updated). If you don't specify an update policy, a *rolling
  update* is chosen by default.

Here's an example of using CloudFormation Init to write a file to the
instance hosts on startup:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  init: ec2.CloudFormationInit.fromElements(
    ec2.InitFile.fromString('/etc/my_instance', 'This got written during instance startup'),
  ),
  signals: autoscaling.Signals.waitForAll({
    timeout: Duration.minutes(10),
  }),
});
```

## Signals

In normal operation, CloudFormation will send a Create or Update command to
an AutoScalingGroup and proceed with the rest of the deployment without waiting
for the *instances in the AutoScalingGroup*.

Configure `signals` to tell CloudFormation to wait for a specific number of
instances in the AutoScalingGroup to have been started (or failed to start)
before moving on. An instance is supposed to execute the
[`cfn-signal`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-signal.html)
program as part of its startup to indicate whether it was started
successfully or not.

If you use CloudFormation Init support (described in the previous section),
the appropriate call to `cfn-signal` is automatically added to the
AutoScalingGroup's UserData. If you don't use the `signals` directly, you are
responsible for adding such a call yourself.

The following type of `Signals` are available:

* `Signals.waitForAll([options])`: wait for all of `desiredCapacity` amount of instances
  to have started (recommended).
* `Signals.waitForMinCapacity([options])`: wait for a `minCapacity` amount of instances
  to have started (use this if waiting for all instances takes too long and you are happy
  with a minimum count of healthy hosts).
* `Signals.waitForCount(count, [options])`: wait for a specific amount of instances to have
  started.

There are two `options` you can configure:

* `timeout`: maximum time a host startup is allowed to take. If a host does not report
  success within this time, it is considered a failure. Default is 5 minutes.
* `minSuccessPercentage`: percentage of hosts that needs to be healthy in order for the
  update to succeed. If you set this value lower than 100, some percentage of hosts may
  report failure, while still considering the deployment a success. Default is 100%.

## Update Policy

The *update policy* describes what should happen to running instances when the definition
of the AutoScalingGroup is changed. For example, if you add a command to the UserData
of an AutoScalingGroup, do the existing instances get replaced with new instances that
have executed the new UserData? Or do the "old" instances just keep on running?

It is recommended to always use an update policy, otherwise the current state of your
instances also depends the previous state of your instances, rather than just on your
source code. This degrades the reproducibility of your deployments.

The following update policies are available:

* `UpdatePolicy.none()`: leave existing instances alone (not recommended).
* `UpdatePolicy.rollingUpdate([options])`: progressively replace the existing
  instances with new instances, in small batches. At any point in time,
  roughly the same amount of total instances will be running. If the deployment
  needs to be rolled back, the fresh instances will be replaced with the "old"
  configuration again.
* `UpdatePolicy.replacingUpdate([options])`: build a completely fresh copy
  of the new AutoScalingGroup next to the old one. Once the AutoScalingGroup
  has been successfully created (and the instances started, if `signals` is
  configured on the AutoScalingGroup), the old AutoScalingGroup is deleted.
  If the deployment needs to be rolled back, the new AutoScalingGroup is
  deleted and the old one is left unchanged.

## Allowing Connections

See the documentation of the `@aws-cdk/aws-ec2` package for more information
about allowing connections between resources backed by instances.

## Max Instance Lifetime

To enable the max instance lifetime support, specify `maxInstanceLifetime` property
for the `AutoscalingGroup` resource. The value must be between 7 and 365 days(inclusive).
To clear a previously set value, leave this property undefined.

## Instance Monitoring

To disable detailed instance monitoring, specify `instanceMonitoring` property
for the `AutoscalingGroup` resource as `Monitoring.BASIC`. Otherwise detailed monitoring
will be enabled.

## Monitoring Group Metrics

Group metrics are used to monitor group level properties; they describe the group rather than any of its instances (e.g GroupMaxSize, the group maximum size). To enable group metrics monitoring, use the `groupMetrics` property.
All group metrics are reported in a granularity of 1 minute at no additional charge.

See [EC2 docs](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-monitoring.html#as-group-metrics) for a list of all available group metrics.

To enable group metrics monitoring using the `groupMetrics` property:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

// Enable monitoring of all group metrics
new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  groupMetrics: [autoscaling.GroupMetrics.all()],
});

// Enable monitoring for a subset of group metrics
new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  groupMetrics: [new autoscaling.GroupMetrics(autoscaling.GroupMetric.MIN_SIZE, autoscaling.GroupMetric.MAX_SIZE)],
});
```

## Termination policies

Auto Scaling uses [termination policies](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-termination.html)
to determine which instances it terminates first during scale-in events. You
can specify one or more termination policies with the `terminationPolicies`
property:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  terminationPolicies: [
    autoscaling.TerminationPolicy.OLDEST_INSTANCE,
    autoscaling.TerminationPolicy.DEFAULT,
  ],
});
```

## Protecting new instances from being terminated on scale-in

By default, Auto Scaling can terminate an instance at any time after launch when
scaling in an Auto Scaling Group, subject to the group's [termination
policy](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-termination.html).

However, you may wish to protect newly-launched instances from being scaled in
if they are going to run critical applications that should not be prematurely
terminated. EC2 Capacity Providers for Amazon ECS requires this attribute be
set to `true`.

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  newInstancesProtectedFromScaleIn: true,
});
```

## Configuring Capacity Rebalancing

Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see [Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html) in the in the Amazon EC2 Auto Scaling User Guide.

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  capacityRebalance: true,
});
```

## Connecting to your instances using SSM Session Manager

SSM Session Manager makes it possible to connect to your instances from the
AWS Console, without preparing SSH keys.

To do so, you need to:

* Use an image with [SSM agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) installed
  and configured. [Many images come with SSM Agent
  preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html), otherwise you
  may need to manually put instructions to [install SSM
  Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-manual-agent-install.html) into your
  instance's UserData or use EC2 Init).
* Create the AutoScalingGroup with `ssmSessionPermissions: true`.

If these conditions are met, you can connect to the instance from the EC2 Console. Example:

```ts
declare const vpc: ec2.Vpc;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),

  // Amazon Linux 2 comes with SSM Agent by default
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),

  // Turn on SSM
  ssmSessionPermissions: true,
});
```

## Configuring Instance Metadata Service (IMDS)

### Toggling IMDSv1

You can configure [EC2 Instance Metadata Service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) options to either
allow both IMDSv1 and IMDSv2 or enforce IMDSv2 when interacting with the IMDS.

To do this for a single `AutoScalingGroup`, you can use set the `requireImdsv2` property.
The example below demonstrates IMDSv2 being required on a single `AutoScalingGroup`:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  requireImdsv2: true,
});
```

You can also use `AutoScalingGroupRequireImdsv2Aspect` to apply the operation to multiple AutoScalingGroups.
The example below demonstrates the `AutoScalingGroupRequireImdsv2Aspect` being used to require IMDSv2 for all AutoScalingGroups in a stack:

```ts
const aspect = new autoscaling.AutoScalingGroupRequireImdsv2Aspect();

Aspects.of(this).add(aspect);
```

## Warm Pool

Auto Scaling offers [a warm pool](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) which gives an ability to decrease latency for applications that have exceptionally long boot times. You can create a warm pool with default parameters as below:

```ts
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.addWarmPool();
```

You can also customize a warm pool by configuring parameters:

```ts
declare const autoScalingGroup: autoscaling.AutoScalingGroup;

autoScalingGroup.addWarmPool({
  minSize: 1,
  reuseOnScaleIn: true,
});
```

### Default Instance Warming

You can use the default instance warmup feature to improve the Amazon CloudWatch metrics used for dynamic scaling.
When default instance warmup is not enabled, each instance starts contributing usage data to the aggregated metrics
as soon as the instance reaches the InService state. However, if you enable default instance warmup, this lets
your instances finish warming up before they contribute the usage data.

To optimize the performance of scaling policies that scale continuously, such as target tracking and step scaling
policies, we strongly recommend that you enable the default instance warmup, even if its value is set to 0 seconds.

To set up Default Instance Warming for an autoscaling group, simply pass it in as a prop

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;


new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType,
  machineImage,

  // ...

  defaultInstanceWarmup: Duration.seconds(5),
});
```

## Future work

* [ ] CloudWatch Events (impossible to add currently as the AutoScalingGroup ARN is
  necessary to make this rule and this cannot be accessed from CloudFormation).
