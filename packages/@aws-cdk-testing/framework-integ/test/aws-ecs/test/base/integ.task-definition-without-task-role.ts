import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-without-task-role');

// Create a task definition without a task role
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefWithoutTaskRole', {
  createTaskRole: false, // Disable task role creation
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
});

new IntegTest(app, 'TaskDefinitionWithoutTaskRole', {
  testCases: [stack],
});

app.synth();
