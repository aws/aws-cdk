import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();

class EventStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly defaultTask: ScheduledFargateTask;
  public readonly customRoleTask: ScheduledFargateTask;
  public readonly containerNameTask: ScheduledFargateTask;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
    this.cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

    // Create the scheduled task
    this.defaultTask = new ScheduledFargateTask(this, 'ScheduledFargateTask', {
      cluster: this.cluster,
      scheduledFargateTaskImageOptions: {
        image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
        command: ['python3', '-c', 'print("hello from scheduled task")'],
        memoryLimitMiB: 512,
        cpu: 256,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });

    // Create the scheduled task with a custom IAM role
    const customRole = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });
    this.customRoleTask = new ScheduledFargateTask(this, 'ScheduledFargateTask3', {
      cluster: this.cluster,
      scheduledFargateTaskImageOptions: {
        image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
        command: ['python3', '-c', 'print("hello from scheduled task")'],
        memoryLimitMiB: 512,
        cpu: 256,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      role: customRole,
    });

    // Create the scheduled task with container name
    this.containerNameTask = new ScheduledFargateTask(this, 'ScheduledFargateTask2', {
      cluster: this.cluster,
      scheduledFargateTaskImageOptions: {
        image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
        command: ['python3', '-c', 'print("hello from scheduled task")'],
        containerName: 'differentName',
        memoryLimitMiB: 512,
        cpu: 256,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });
  }
}

const myStack = new EventStack(app, 'aws-fargate-integ');

const integTest = new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
  testCases: [myStack],
});

// The scheduled tasks run every 2 minutes; wait until each rule has run a
// task in the cluster to prove every EventBridge rule actually runs tasks.
// The tasks run a short-lived command and stop, so assert on STOPPED tasks:
// asserting on a running task would leave active tasks in the cluster and
// the cluster could not be deleted when the test stack is destroyed.
// Once every rule has run, turn the rules off and wait until no task is
// still running, so the cluster delete does not race a task the rules
// would otherwise keep starting.
const tasks = [myStack.defaultTask, myStack.customRoleTask, myStack.containerNameTask];

// The command exits right away, so look for a STOPPED task from each rule
const ran = tasks.map(task => integTest.assertions.awsApiCall('ECS', 'listTasks', {
  cluster: myStack.cluster.clusterArn,
  family: task.taskDefinition.family,
  desiredStatus: 'STOPPED',
}).assertAtPath('taskArns.0', integ.ExpectedResult.stringLikeRegexp('arn:aws:ecs:.*:task/.*/.*')).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
}));

// Stop the schedules and wait until no task is still running, so the cluster delete doesn't race them
const disabled = tasks.map(task => integTest.assertions.awsApiCall('EventBridge', 'disableRule', {
  Name: task.eventRule.ruleName,
}));
const drained = integTest.assertions.awsApiCall('ECS', 'listTasks', {
  cluster: myStack.cluster.clusterArn,
}).expect(integ.ExpectedResult.objectLike({ taskArns: [] })).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
});

[...ran, ...disabled, drained].reduce((prev, call) => prev.next(call));
