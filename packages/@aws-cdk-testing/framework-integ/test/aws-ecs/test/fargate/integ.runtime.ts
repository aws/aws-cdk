import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-runtime');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
});

const taskDefinitionwindows = new ecs.FargateTaskDefinition(stack, 'TaskDefWindows', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
  },
  cpu: 1024,
  memoryLimitMiB: 2048,
});

const taskDefinitiongraviton2 = new ecs.FargateTaskDefinition(stack, 'TaskDefGraviton2', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
    cpuArchitecture: ecs.CpuArchitecture.ARM64,
  },
  cpu: 256,
  memoryLimitMiB: 1024,
  pidMode: ecs.PidMode.TASK,
});

taskDefinitionwindows.addContainer('windowsservercore', {
  logging: ecs.LogDriver.awsLogs({ streamPrefix: 'win-iis-on-fargate' }),
  portMappings: [{ containerPort: 80 }],
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019'),
});

taskDefinitiongraviton2.addContainer('webarm64', {
  logging: ecs.LogDriver.awsLogs({ streamPrefix: 'graviton2-on-fargate' }),
  portMappings: [{ containerPort: 80 }],
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest-arm64v8'),
});

new ecs.FargateService(stack, 'FargateServiceWindowsRuntime', {
  cluster,
  taskDefinition: taskDefinitionwindows,
});

new ecs.FargateService(stack, 'FargateServiceGraviton2Runtime', {
  cluster,
  taskDefinition: taskDefinitiongraviton2,
});

app.synth();
