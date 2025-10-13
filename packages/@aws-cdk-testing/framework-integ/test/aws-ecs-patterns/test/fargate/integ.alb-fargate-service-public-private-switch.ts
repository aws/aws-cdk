import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-fargate-public-private-switch');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Test private load balancer (the problematic case from the issue)
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'PrivateALBFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  publicLoadBalancer: false, // This should create ECSPrivate target group
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

// Test public load balancer for comparison
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'PublicALBFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  publicLoadBalancer: true, // This should create ECS target group
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'ALBFargatePublicPrivateSwitchTest', {
  testCases: [stack],
  allowDestroy: [
    'PrivateALBFargateServiceLB3F43693F',
    'PrivateALBFargateServiceLBPublicListenerECSPrivateGroup81AA5B8B',
    'PublicALBFargateServiceLBBDD839E7',
    'PublicALBFargateServiceLBPublicListenerECSGroupD991EA00',
  ],
});

app.synth();
