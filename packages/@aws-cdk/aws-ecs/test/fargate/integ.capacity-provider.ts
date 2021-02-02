import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
  capacityProvider: [
    ecs.FargateCapacityProviderType.FARGATE,
    ecs.FargateCapacityProviderType.FARGATE_SPOT,
  ],
  defaultCapacityProviderStrategy: [
    {
      capacityProvider: ecs.FargateCapacityProviderType.FARGATE,
      weight: 1,
      base: 1,
    },
    {
      capacityProvider: ecs.FargateCapacityProviderType.FARGATE_SPOT,
      weight: 2,
    },
  ],
});

app.synth();
