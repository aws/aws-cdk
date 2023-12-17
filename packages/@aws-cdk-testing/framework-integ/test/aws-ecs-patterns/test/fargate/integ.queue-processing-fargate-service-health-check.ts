import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue-public');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const CONTAINER_HEALTH_CHECK_KEY = 'CONTAINER_HEALTH_CHECK_KEY';

new QueueProcessingFargateService(stack, 'PublicQueueService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  assignPublicIp: true,
  healthCheck: {
    command: ['CMD-SHELL', '%CONTAINER_HEALTH_CHECK_KEY% || exit 1'],
    interval: Duration.seconds(10),
    retries: 10,
  },
  environment: {
    CONTAINER_HEALTH_CHECK_KEY: CONTAINER_HEALTH_CHECK_KEY
  }
});

new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
