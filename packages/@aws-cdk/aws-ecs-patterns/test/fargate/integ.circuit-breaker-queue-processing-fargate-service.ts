import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as integ from '@aws-cdk/integ-tests';
import { QueueProcessingFargateService } from '../../lib';

const app = new App({ postCliContext: { [cxapi.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER]: false } });
const stack = new Stack(app, 'aws-ecs-patterns-queue');
const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  memoryLimitMiB: 512,
  circuitBreaker: { rollback: true },
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
});

new integ.IntegTest(app, 'circuitBreakerQueueProcessingFargateTest', {
  testCases: [stack],
});

app.synth();
