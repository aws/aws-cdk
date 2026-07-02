import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-ecs-fargate-windows-ephemeral-storage');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_FULL,
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
  },
  cpu: 2048,
  memoryLimitMiB: 4096,
  ephemeralStorageGiB: 40,
});

taskDefinition.addContainer('web', {
  // Use an explicit ltsc2019 tag to match WINDOWS_SERVER_2019 (10.0.17763)
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/windows/servercore/iis:ltsc2019'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  platformVersion: ecs.FargatePlatformVersion.VERSION1_0,
  // Keep integ runs stable even if the runner deploys:
  // no need to actually start tasks to validate synth/snapshot content.
  desiredCount: 0,
});

new IntegTest(app, 'FargateWindowsEphemeralStorage', {
  testCases: [stack],
});
