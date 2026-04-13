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
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/dotnet/framework/samples:aspnetapp'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  platformVersion: ecs.FargatePlatformVersion.VERSION1_0,
});

new IntegTest(app, 'FargateWindowsEphemeralStorage', {
  testCases: [stack],
});
