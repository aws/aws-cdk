import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Queue } from 'aws-cdk-lib/aws-sqs';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue');

const queue = new Queue(stack, 'CdkAppQueue', {
});

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  minScalingCapacity: 0,
  queue,
  enableBacklogPerInstanceBasedScaling: true,
  backlogPerInstanceTargetValue: 100,
  disableCpuBasedScaling: true,
});

new integ.IntegTest(app, 'queueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();

