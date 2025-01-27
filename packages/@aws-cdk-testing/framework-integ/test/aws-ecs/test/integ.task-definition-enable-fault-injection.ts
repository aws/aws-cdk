import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-enable-fault-injection');

const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDefinition', {
  enableFaultInjection: true,
  networkMode: ecs.NetworkMode.HOST,
});
ec2TaskDefinition.addContainer('Ec2Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 512,
});

const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDefinition', {
  enableFaultInjection: true,
});
fargateTaskDefinition.addContainer('FargateContainer', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 512,
});

new IntegTest(app, 'TaskDefinitionEnableFaultInjection', {
  testCases: [stack],
});
