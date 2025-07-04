import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  Ec2TaskDefinition,
  ContainerImage,
  Cluster,
  AsgCapacityProvider,
  EcsOptimizedImage,
} from 'aws-cdk-lib/aws-ecs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { EcsRunEc2Task } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * A task run is scheduled every 30 minutes (should only have 1 task run during the integration test run)
 * The assertion checks that the cluster has tasks being run
 *
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-ecs-run-task-ec2-schedule');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 1,
});

// Create an ECS cluster with EC2 capacity
const cluster = new Cluster(stack, 'Ec2Cluster', { vpc });
const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: EcsOptimizedImage.amazonLinux2(),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  associatePublicIpAddress: true,
});

const cp = new AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp);

// Create an EC2 task definition
const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDefinition');
taskDefinition.addContainer('ScheduledContainer', {
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

// Create the ECS run task target
const ecsRunTaskTarget = new EcsRunEc2Task(cluster, {
  taskDefinition,
  tags: [
    {
      key: 'integ-test-tag-key',
      value: 'integ-test-tag-value',
    },
  ],
  propagateTags: true,
  capacityProviderStrategies: [
    {
      capacityProvider: cp.capacityProviderName,
      weight: 1,
      base: 1,
    },
  ],
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(30)),
  target: ecsRunTaskTarget,
});

const integ = new IntegTest(app, 'integ-ecs-run-task-ec2', {
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
