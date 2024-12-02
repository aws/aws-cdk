import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stack, App } from 'aws-cdk-lib';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Application } from 'aws-cdk-lib/aws-appconfig';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-application');

new Application(stack, 'MyAppConfig', {
  description: 'This is my application for testing',
  applicationName: 'MySampleApplication',
});

const taskDef = new FargateTaskDefinition(stack, 'MyTaskDef');
Application.addAgentToEcs(taskDef);

/* resource deployment alone is sufficient because we already have the
   corresponding resource handler tests to assert that resources can be
   used after created */

new IntegTest(app, 'appconfig-application', {
  testCases: [stack],
});
