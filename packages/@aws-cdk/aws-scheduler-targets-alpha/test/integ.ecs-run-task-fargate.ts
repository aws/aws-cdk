import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { FargateTaskDefinition, ContainerImage, Cluster, LaunchType } from 'aws-cdk-lib/aws-ecs';
import { EcsRunTask } from '../lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';

/*
 * Stack verification steps:
 * A task run is scheduled every minute
 * The assertion checks that the cluster has tasks being run
 *
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ecs-run-task-fargate-schedule');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new FargateTaskDefinition(stack, 'FargateTaskDefinition', {
  cpu: 256,
  memoryLimitMiB: 512,
});
taskDefinition.addContainer('ScheduledContainer', {
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

const ecsRunTaskTarget = new EcsRunTask(cluster, {
  taskDefinition,
  propagateTags: true,
  launchType: LaunchType.FARGATE,
  tags: [{
    key: 'integ-test-tag-key',
    value: 'I_ADDED_THIS',
  }],
  enableEcsManagedTags: true,
  enableExecuteCommand: true,
  group: 'group',
  deadLetterQueue: new Queue(stack, 'DLQ'),
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(30)),
  target: ecsRunTaskTarget,
});

const integ = new IntegTest(app, 'integ-ecs-run-task-fargate', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const tasks = integ.assertions.awsApiCall('ECS', 'listTasks', {
  cluster: cluster.clusterArn,
}).assertAtPath('taskArns.0', ExpectedResult.stringLikeRegexp('arn:aws:ecs:.*:task/.*/.*')).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(30),
});

const taskArn = tasks.getAttString('taskArns.0');

integ.assertions.awsApiCall('ECS', 'stopTask', {
  cluster: cluster.clusterArn,
  task: taskArn,
});

// Wait for tasks to be in STOPPED state or else the cluster deletion will fail
integ.assertions.awsApiCall('ECS', 'describeTasks', {
  cluster: cluster.clusterArn,
  tasks: [taskArn],
}).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
}).expect(ExpectedResult.objectLike({
  tasks: Match.arrayWith([
    Match.objectLike({ lastStatus: 'STOPPED' }),
  ]),
}));
