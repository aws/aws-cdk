# AWS ECS - L3 Construct for Scheduling EC2 Tasks

To address issue [#2352](https://github.com/aws/aws-cdk/issues/2352), the ECS CDK construct library should provide a way for customers to create a standalone scheduled task, without creating a service, for their container. The task will be initiated by a cloudwatch event that is scheduled based on [CW Scheduled Events](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html).

This would mean adding a new ECS CDK construct `ScheduledEc2Task`, that would take in the necessary properties required to create a Task Definition, an EventRuleTarget as well as an AWS EventRule.

Note: Currently, ScheduledTasks, via CloudFormation, are only supported for EC2 and not for Fargate. CloudFormation does not support every [EcsParameter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html) that is supported by the [Amazon CloudWatch Events API](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_EcsParameters.html). It is currently missing the following custom parameters:

* Group
* LaunchType
* NetworkConfiguration
* PlatformVersion

TaskDefinitions contain a NetworkMode, and EC2 can support none, bridge, host or awsvpc (which requires a NetworkConfiguration attribute). However, TaskDefinitions running on Fargate can only support a NetworkMode of awsvpc. For this construct, we're creating a scheduled task (that is standalone task, not backed with a service). It works for ECS because we're using bridge as the NetworkMode, which does not require a NetworkConfiguration to be present.

## General approach

The new [`ecs.ScheduledEc2Task`] class will include an L3 construct for:

* ScheduledEc2Task

A `ScheduledEc2Task` will create a task definition with the specified container. An `Ec2EventRuleTarget` will be created and associated as the target to an `Amazon Cloudwatch Event Rule` (indicating how frequently the task should be run). Based on the `Amazon Cloudwatch Event Rule` schedule, a task will run on the EC2 instances specified in the cluster.

## Code changes

Given the above, we should make the following changes to support scheduled tasks on ECS:
1. Create `ScheduledEc2TaskProps` interface  and `ScheduledEc2Task` construct

# Part 1: Create `ScheduledEc2TaskProps` interface  and `ScheduledEc2Task` construct

The `ScheduledEc2TaskProps` interface will contain properties to construct the Ec2TaskDefinition, Ec2EventRuleTarget and EventRule:

```ts
export interface ScheduledEc2TaskProps {
  /**
   * The cluster where your service will be deployed.
   */
  readonly cluster: ICluster;

  /**
   * The image to start.
   */
  readonly image: ContainerImage;

  /**
   * The schedule or rate (frequency) that determines when CloudWatch Events
   * runs the rule. For more information, see Schedule Expression Syntax for
   * Rules in the Amazon CloudWatch User Guide.
   *
   * @see http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
   *
   * You must specify this property.
   */
  readonly scheduleExpression: string;

  /**
   * The CMD value to pass to the container. A string with commands delimited by commas.
   *
   * @default none
   */
  readonly command?: string;

  /**
   * The minimum number of CPU units to reserve for the container.
   *
   * @default none
   */
  readonly cpu?: number;

  /**
   * Number of desired copies of running tasks.
   *
   * @default 1
   */
  readonly desiredTaskCount?: number;

  /**
   * The environment variables to pass to the container.
   *
   * @default none
   */
  readonly environment?: { [key: string]: string };

  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory limit.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;
}
```

The `ScheduledEc2Task` construct will use the following existing constructs:

* Ec2TaskDefinition - To create a Task Definition for the container to start
* Ec2EventRuleTarget - The target of the AWS event
* EventRule - To describe the event trigger (in this case, a scheduled run)

An example use case to create a task that is scheduled to run every minute:
```ts
// Create the vpc and cluster used by the scheduled task
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro')
});

// Create the scheduled task
new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
  cluster,
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  desiredTaskCount: 2,
  memoryLimitMiB: 512,
  cpu: 1,
  environment: { name: 'TRIGGER', value: 'CloudWatch Events' },
  scheduleExpression: 'rate(1 minute)'
});
```
