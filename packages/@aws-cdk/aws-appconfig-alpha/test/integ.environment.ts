import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Application, Environment } from '../lib';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-environment');

// create resources needed for environment
const appForEnv = new Application(stack, 'MyApplicationForEnv', {
  name: 'AppForEnvTest',
});
const alarm = new Alarm(stack, 'MyAlarm', {
  metric: new Metric({
    namespace: 'aws',
    metricName: 'dummy name',
  }),
  evaluationPeriods: 5,
  threshold: 10,
});

// create environment with all props defined
new Environment(stack, 'MyEnvironment', {
  application: appForEnv,
  description: 'This is the environment for integ testing',
  monitors: [
    {
      alarm,
    },
  ],
});

new IntegTest(app, 'appconfig-environment', {
  testCases: [stack],
});
