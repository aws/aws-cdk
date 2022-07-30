import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ecs from '../../lib';
import { LinuxParameters } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// ECS cluster to host EC2 task
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

// define task to run the container
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition', {
  networkMode: ecs.NetworkMode.AWS_VPC,
});

// define linux parameters to enable swap
const linuxParameters = new LinuxParameters(stack, 'LinuxParameters', {
  maxSwap: 5e3,
  swappiness: 90,
});

// define container with linux parameters
new ecs.ContainerDefinition(stack, 'Container', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  linuxParameters,
  memoryLimitMiB: 256,
  taskDefinition,
});

// define a service to run the task definition
new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
});

new integ.IntegTest(app, 'SwapParametersTest', {
  testCases: [stack],
});

app.synth();