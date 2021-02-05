import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const defaultCapacityProviderStrategy = [
  {
    capacityProvider: ecs.FargateCapacityProviderType.FARGATE,
    weight: 1,
    base: 1,
  },
  {
    capacityProvider: ecs.FargateCapacityProviderType.FARGATE_SPOT,
    weight: 2,
  },
];

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  defaultCapacityProviderStrategy,
});

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
  networkMode: ecs.NetworkMode.AWS_VPC,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

// we are allowed to create Ec2Service even the cluster defaultCapacityProviderStrategy is fargate
// as we leave the capacityProviderStrategy undefined, the launch type will be explicitly defined as EC2.
new ecs.Ec2Service(stack, 'Ec2Service', {
  cluster,
  taskDefinition,
});

app.synth();
