import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

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
