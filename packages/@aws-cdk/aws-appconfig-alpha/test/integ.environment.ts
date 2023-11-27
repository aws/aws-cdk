import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Application, ConfigurationContent, DeploymentStrategy, Environment, HostedConfiguration, Monitor, RolloutStrategy } from '../lib';
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
const env = new Environment(stack, 'MyEnvironment', {
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

// try to deploy to that environment to make sure everything is
// configured properly
const config = new HostedConfiguration(stack, 'MyHostedConfig', {
  content: ConfigurationContent.fromInlineText('config content'),
  deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
    rolloutStrategy: RolloutStrategy.LINEAR_50_PERCENT_EVERY_30_SECONDS,
  }),
  application: appForEnv,
  deployTo: [env],
});

config.node.addDependency(alarm, compositeAlarm);

new IntegTest(app, 'appconfig-environment', {
  testCases: [stack],
});
