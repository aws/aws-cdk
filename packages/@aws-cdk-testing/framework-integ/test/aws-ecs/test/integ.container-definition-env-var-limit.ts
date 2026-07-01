import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-container-definition-env-var-limit');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

const environment: { [key: string]: string } = {};
for (let i = 1; i <= 100; i++) {
  environment[`VAR_${i}`] = `value${i}`;
}

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  memoryLimitMiB: 512,
  environment,
});

new IntegTest(app, 'ContainerDefinitionEnvVarLimit', {
  testCases: [stack],
});
