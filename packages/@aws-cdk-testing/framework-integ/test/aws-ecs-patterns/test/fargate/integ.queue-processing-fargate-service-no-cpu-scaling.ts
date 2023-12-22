import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue-no-cpu-scaling');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

new QueueProcessingFargateService(stack, 'aws-ecs-patterns-queue-no-cpu-scaling', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  assignPublicIp: true,
  disableCpuBasedScaling: true,
});

new integ.IntegTest(app, 'noCpuScalingQueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
