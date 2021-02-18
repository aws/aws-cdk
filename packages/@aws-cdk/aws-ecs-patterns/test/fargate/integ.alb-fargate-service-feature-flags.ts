import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecsPatterns from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'L3', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

app.synth();
