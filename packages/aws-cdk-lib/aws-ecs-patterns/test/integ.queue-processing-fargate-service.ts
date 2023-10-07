import * as cdk from 'aws-cdk-lib/core';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecsPatterns from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ecs-patterns-1');

const vpc = new ec2.Vpc(stack, 'Vpc');
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition', {
  cpu: 256,
  memoryLimitMiB: 512,
});

new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  image: ecs.ContainerImage.fromRegistry('test'),
});

new integ.IntegTest(app, 'QueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();