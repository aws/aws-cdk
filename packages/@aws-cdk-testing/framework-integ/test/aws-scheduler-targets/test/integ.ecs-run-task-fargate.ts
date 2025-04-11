import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { FargateTaskDefinition, ContainerImage, Cluster } from 'aws-cdk-lib/aws-ecs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { EcsRunFargateTask } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * A task run is scheduled every 30 minutes (should only have 1 task run during the integration test run)
 * The assertion checks that the cluster has tasks being run
 *
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ecs-run-task-fargate-schedule');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'FargateCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

const taskDefinition = new FargateTaskDefinition(stack, 'FargateTaskDefinition', {
  cpu: 256,
  memoryLimitMiB: 512,
});
taskDefinition.addContainer('ScheduledContainer', {
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

const ecsRunTaskTarget = new EcsRunFargateTask(cluster, {
  taskDefinition,
  propagateTags: true,
  tags: [{
    key: 'integ-test-tag-key',
    value: 'integ-test-tag-value',
  }],
  enableEcsManagedTags: false,
  enableExecuteCommand: true,
  securityGroups: [],
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

app.synth();
