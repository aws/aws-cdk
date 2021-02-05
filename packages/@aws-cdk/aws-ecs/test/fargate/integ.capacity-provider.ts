import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const defaultCapacityProviderStrategy = [
  {
    capacityProvider: 'FARGATE',
    weight: 1,
    base: 1,
  },
  {
    capacityProvider: 'FARGATE_SPOT',
    weight: 2,
  },
];

const cluster = new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
  defaultCapacityProviderStrategy,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Task', {
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  capacityProviderStrategy: defaultCapacityProviderStrategy,
});

app.synth();
