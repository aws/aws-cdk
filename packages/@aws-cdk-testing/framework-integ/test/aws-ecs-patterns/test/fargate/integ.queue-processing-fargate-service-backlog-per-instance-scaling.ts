import * as path from 'path';
import { Cluster, AssetImage, ContainerInsights } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Queue } from 'aws-cdk-lib/aws-sqs';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue-backlog-per-instance-scaling');

const queue = new Queue(stack, 'CdkAppQueue', {
});

const cluster = new Cluster(stack, 'EcsCluster', { containerInsightsV2: ContainerInsights.ENABLED });

new QueueProcessingFargateService(stack, 'backlogPerInstanceQueueProcessingFargateServiceTest', {
  cluster,
  memoryLimitMiB: 512,
  image: new AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  minScalingCapacity: 0,
  queue,
  enableBacklogPerInstanceBasedScaling: true,
  backlogPerInstanceTargetValue: 100,
  disableCpuBasedScaling: true,
});

new integ.IntegTest(app, 'queueProcessingFargateServiceTest', {
  testCases: [stack],
});

// app.synth();
