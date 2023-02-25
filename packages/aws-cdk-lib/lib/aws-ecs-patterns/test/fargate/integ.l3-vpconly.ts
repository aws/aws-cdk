import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import * as cdk from '../../../core';
import * as integ from '../../../integ-tests';
import * as ecsPatterns from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-l3-vpconly');

// Create VPC only
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// Create ALB service
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALBFargateService', {
  vpc,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

// Create NLB service
new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
  vpc,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'vpcOnlyFargateTest', {
  testCases: [stack],
});

app.synth();
