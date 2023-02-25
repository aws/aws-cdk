import * as ecs from '../../../aws-ecs';
import * as cdk from '../../../core';
import * as integ from '../../../integ-tests';
import * as ecsPatterns from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-l3-autocreate');

// No VPC or Cluster specified

// Create ALB service
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALBFargateService', {
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

// Create NLB service
new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'autoCreateNlbFargateTest', {
  testCases: [stack],
});

app.synth();
