import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as targets from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-integ-ecs');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');

// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// An Rule that describes the event trigger (in this case a scheduled run)
const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

// Use EcsTask as the target of the Rule
rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  taskCount: 1,
  containerOverrides: [{
    containerName: 'TheContainer',
    environment: [
      { name: 'I_WAS_TRIGGERED', value: 'From CloudWatch Events' },
    ],
  }],
  deadLetterQueue,
}));

new integ.IntegTest(app, 'EcsTest', {
  testCases: [stack],
});

app.synth();
