import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-lb-fargate-ephemeral-storage');

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Create ALB service
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALBFargateServiceWithCustomEphemeralStorage', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  ephemeralStorageGiB: 200,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

// Create NLB service
new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateServiceWithCustomEphemeralStorage', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  ephemeralStorageGiB: 150,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'l3FargateWithCustomEphemeralStorageTest', {
  testCases: [stack],
});

app.synth();
