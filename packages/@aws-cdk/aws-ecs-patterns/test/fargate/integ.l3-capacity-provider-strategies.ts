import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsPatterns from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-lb-fargate');

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
cluster.enableFargateCapacityProviders();

// Create ALB service with capacity provider storategies
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALBFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  capacityProviderStrategies: [
    {
      capacityProvider: 'FARGATE',
      base: 1,
      weight: 1,
    },
    {
      capacityProvider: 'FARGATE_SPOT',
      base: 0,
      weight: 2,
    },
  ],
});

// Create NLB service with capacity provider storategies
new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  capacityProviderStrategies: [
    {
      capacityProvider: 'FARGATE',
      base: 1,
      weight: 1,
    },
    {
      capacityProvider: 'FARGATE_SPOT',
      base: 0,
      weight: 2,
    },
  ],
});

app.synth();
