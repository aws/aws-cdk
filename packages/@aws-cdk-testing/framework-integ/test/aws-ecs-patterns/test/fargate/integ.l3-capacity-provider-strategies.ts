import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-lb-fargate');

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
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
const nlbFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
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
nlbFargateService.service.connections.allowFrom(nlbFargateService.loadBalancer, ec2.Port.tcp(80));

new integ.IntegTest(app, 'l3CapacityProviderStrategiesTest', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // https://github.com/aws/aws-cdk/issues/19275
      expectError: true,
    },
  },
});

app.synth();
