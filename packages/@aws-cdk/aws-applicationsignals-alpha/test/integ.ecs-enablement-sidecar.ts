
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Role, ManagedPolicy, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ApplicationSignalsIntegration, DotnetInstrumentationVersion } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ecs-enablement-integration');

const taskRole = new Role(stack, 'TestRole', {
  roleName: 'TestRole',
  assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
  managedPolicies: [
    ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
  ],
});

const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDefinition', {
  taskRole: taskRole,
  cpu: 2048,
  memoryLimitMiB: 4096,
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
  },
});

fargateTaskDefinition.addContainer('app', {
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
});
new ApplicationSignalsIntegration(stack, 'TestFargateSidecarIntegration', {
  taskDefinition: fargateTaskDefinition,
  instrumentation: {
    sdkVersion: DotnetInstrumentationVersion.V1_6_0_WINDOWS2019,
  },
  serviceName: 'demo',
  cloudWatchAgent: {
    enableSidecar: true,
    container: {
      containerName: 'cwagent',
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/cloudwatch-agent/cloudwatch-agent:1.300051.0b992-windowsservercore2019'),
    },
  },
});

new integ.IntegTest(app, 'ApplicationSignalsIntegrationECSSidecar', {
  testCases: [stack],
});

app.synth();

