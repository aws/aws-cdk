import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-runtime');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });


const cluster = new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
  },
  cpu: 1024,
  memoryLimitMiB: 2048,
});

taskDefinition.addContainer('windowsservercore', {
  logging: ecs.LogDriver.awsLogs({ streamPrefix: 'win-iis-on-fargate' }),
  portMappings: [{ containerPort: 80 }],
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
});

app.synth();