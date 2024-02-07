import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, App } from 'aws-cdk-lib';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Application } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-application');

new Application(stack, 'MyAppConfig', {
  description: 'This is my application for testing',
});

const taskDef = new FargateTaskDefinition(stack, 'MyTaskDef');
Application.addAgentToEcs(taskDef);

new IntegTest(app, 'appconfig-application', {
  testCases: [stack],
});