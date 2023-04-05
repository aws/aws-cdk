import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(
  app,
  'aws-ecs-integ-lb-fargate-cmd-entrypoint-test',
);

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'TestFargateCluster', { vpc });

// Create ALB service with Command and EntryPoint
new ecsPatterns.ApplicationLoadBalancedFargateService(
  stack,
  'ALBFargateServiceWithCommandAndEntryPoint',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      command: ['/usr/sbin/apache2', '-D', 'FOREGROUND'],
      entryPoint: ['/bin/bash'],
    },
  },
);

new integ.IntegTest(app, 'AlbFargateServiceWithCommandAndEntryPoint', {
  testCases: [stack],
});

app.synth();
