import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue-ephemeral-storage');
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingServiceWithCustomEphemeralStorage', {
  vpc,
  memoryLimitMiB: 512,
  ephemeralStorageGiB: 100,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  minScalingCapacity: 0,
});

new integ.IntegTest(app, 'queueProcessingFargateServiceWithCustomEphemeralStorageTest', {
  testCases: [stack],
});

app.synth();
