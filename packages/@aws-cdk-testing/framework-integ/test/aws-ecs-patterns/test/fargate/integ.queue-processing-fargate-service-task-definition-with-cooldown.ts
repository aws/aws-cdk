import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-queu-no-cooldown');
const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new QueueProcessingFargateService(stack, 'QueueProcessingService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  minScalingCapacity: 0,
  cooldown: Duration.seconds(600),
});

new integ.IntegTest(app, 'queueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();
