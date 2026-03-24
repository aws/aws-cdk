import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { CloudWatchAgentIntegration } from '@aws-cdk/aws-applicationsignals-alpha';

const app = new App();
const stack = new Stack(app, 'CloudWatchAgentWindowsStack');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_FULL,
  },
  cpu: 2048,
  memoryLimitMiB: 4096,
});

taskDefinition.addContainer('app', {
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/dotnet/samples:aspnetapp'),
});

new CloudWatchAgentIntegration(stack, 'CloudWatchAgent', {
  containerName: 'cloudwatch-agent',
  taskDefinition,
  cpu: 512,
  memoryLimitMiB: 1024,
  operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_FULL,
});

new IntegTest(app, 'CloudWatchAgentWindowsInteg', {
  testCases: [stack],
});
