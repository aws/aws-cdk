import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-ulimits');

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
  ulimits: [{
    hardLimit: 128,
    name: ecs.UlimitName.RSS,
    softLimit: 128,
  }],
});

new IntegTest(app, 'TaskDefinitionContainerUlimits', {
  testCases: [stack],
});

app.synth();
