import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Application, Environment, Monitor } from '../lib';
import { Alarm, CompositeAlarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

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
const role = new Role(stack, 'MyRole', {
  assumedBy: new ServicePrincipal('appconfig.amazonaws.com'),
});
const compositeAlarm = new CompositeAlarm(stack, 'MyCompositeAlarm', {
  alarmRule: alarm,
});

// create environment with all props defined
new Environment(stack, 'MyEnvironment', {
  application: appForEnv,
  description: 'This is the environment for integ testing',
  monitors: [
    Monitor.fromCloudWatchAlarm(alarm),
    Monitor.fromCfnMonitorsProperty({
      alarmArn: alarm.alarmArn,
      alarmRoleArn: role.roleArn,
    }),
    Monitor.fromCloudWatchAlarm(compositeAlarm),
  ],
});

new IntegTest(app, 'appconfig-environment', {
  testCases: [stack],
});
