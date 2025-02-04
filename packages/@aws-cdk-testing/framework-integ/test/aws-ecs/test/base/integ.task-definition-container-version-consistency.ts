import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-task-definition-container-version-consistency');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  versionConsistency: ecs.VersionConsistency.DISABLED,
});

new IntegTest(app, 'TaskDefinitionContainerRestartPolicy', {
  testCases: [stack],
});
