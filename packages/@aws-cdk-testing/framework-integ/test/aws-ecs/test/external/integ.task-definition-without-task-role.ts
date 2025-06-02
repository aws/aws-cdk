import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-external-task-definition-without-task-role');

// Create an External task definition without a task role
const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDefWithoutTaskRole', {
  createTaskRole: false, // Disable task role creation
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 256,
});

new IntegTest(app, 'ExternalTaskDefinitionWithoutTaskRole', {
  testCases: [stack],
});

app.synth();
