import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';

import { QueueProcessingFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue');
stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
});

app.synth();
