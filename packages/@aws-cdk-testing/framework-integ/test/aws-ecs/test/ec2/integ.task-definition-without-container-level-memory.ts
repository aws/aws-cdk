import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-without-container-level-memory');

const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
  compatibility: ecs.Compatibility.EC2,
  cpu: '256',
  family: 'app',
  memoryMiB: '512',
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
});

new IntegTest(app, 'TaskDefinitionWithoutContainerLevelMemory', {
  testCases: [stack],
});

app.synth();
