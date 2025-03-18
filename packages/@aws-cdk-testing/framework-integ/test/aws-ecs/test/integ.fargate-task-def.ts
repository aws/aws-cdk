import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-fargate-task-def');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDefinition.addContainer('SampleContainer', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  essential: true,
  portMappings: [
    { containerPort: 80, hostPort: 80, protocol: ecs.Protocol.TCP },
  ],
});

new IntegTest(app, 'FargateTaskDefinition', {
  testCases: [stack],
});

app.synth();
