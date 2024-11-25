import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Stack, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT } from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-queue-health-check');
stack.node.setContext(ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT, true);

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

new QueueProcessingFargateService(stack, 'HealthCheckQueueService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  assignPublicIp: true,
  healthCheck: {
    command: ['CMD-SHELL', 'cat /tmp/health_status | grep -q "1" || exit 1'],
    interval: Duration.seconds(10),
    retries: 10,
  },
});

new integ.IntegTest(app, 'healthCheckQueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
