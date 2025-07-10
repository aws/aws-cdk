import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-restart-policy');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  enableRestartPolicy: true,
  restartIgnoredExitCodes: [0, 127],
  restartAttemptPeriod: cdk.Duration.seconds(360),
});

new IntegTest(app, 'TaskDefinitionContainerRestartPolicy', {
  testCases: [stack],
});

app.synth();
