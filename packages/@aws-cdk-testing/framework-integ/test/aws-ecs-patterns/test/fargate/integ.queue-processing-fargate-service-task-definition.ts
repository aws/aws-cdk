import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-queue');
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
  ephemeralStorageGiB: 30,
});

taskDefinition.addContainer('TheContainer', {
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  logging: new ecs.AwsLogDriver({ streamPrefix: 'QueueProcessingFargateService' }),
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  taskDefinition,
});

new integ.IntegTest(app, 'taskDefinitionQueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
