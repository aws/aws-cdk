import * as path from 'path';
import * as ec2 from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import { App, Stack } from '../../../core';
import * as integ from '../../../integ-tests';
import { QueueProcessingFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue');
const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  minScalingCapacity: 0,
});

new integ.IntegTest(app, 'queueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
