import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, PhysicalName, Stack } from 'aws-cdk-lib';
import { Alarm, ComparisonOperator, CompositeAlarm, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { Role, ServicePrincipal, Effect, PolicyStatement, PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { Application, ConfigurationContent, DeletionProtectionCheck, DeploymentStrategy, Environment, HostedConfiguration, Monitor, RolloutStrategy } from 'aws-cdk-lib/aws-appconfig';

const app = new App();

const stack = new Stack(app, 'aws-appconfig-environment');

// create resources needed for environment
const appForEnv = new Application(stack, 'MyApplicationForEnv', {
  applicationName: 'AppForEnvTest',
});
const alarm = new Alarm(stack, 'StartDeploymentCallCountAlarm', {
  alarmName: 'AppConfigStartDeploymentCallCountAlarm',
  metric: new Metric({
    namespace: 'AWS/AppConfig',
    metricName: 'CallCount',
    dimensionsMap: {
      Type: 'API',
      Resource: 'StartDeployment',
      Service: 'AWS AppConfig',
    },
    statistic: 'SUM',
    period: Duration.minutes(5),
  }),
  threshold: 300,
  comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  evaluationPeriods: 3,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  actionsEnabled: false,
});
const policy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['cloudwatch:DescribeAlarms'],
  resources: ['*'],
});
const document = new PolicyDocument({
  statements: [policy],
});
const role = new Role(stack, 'MyRole', {
  roleName: PhysicalName.GENERATE_IF_NEEDED,
  assumedBy: new ServicePrincipal('appconfig.amazonaws.com'),
  inlinePolicies: {
    ['AllowAppConfigMonitorAlarmPolicy']: document,
  },
});
const compositeAlarm = new CompositeAlarm(stack, 'MyCompositeAlarm', {
  alarmRule: alarm,
});

// create environment with all props defined
const env = new Environment(stack, 'MyEnvironment', {
  application: appForEnv,
  description: 'This is the environment for integ testing',
  deletionProtectionCheck: DeletionProtectionCheck.ACCOUNT_DEFAULT,
  monitors: [
    Monitor.fromCloudWatchAlarm(alarm),
    Monitor.fromCfnMonitorsProperty({
      alarmArn: alarm.alarmArn,
      alarmRoleArn: role.roleArn,
    }),
    Monitor.fromCloudWatchAlarm(compositeAlarm),
  ],
});

// ensure the service can track the monitors in the environment
new HostedConfiguration(stack, 'MyConfig', {
  application: appForEnv,
  content: ConfigurationContent.fromInline('config content'),
  deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
    rolloutStrategy: RolloutStrategy.linear({
      deploymentDuration: Duration.minutes(1),
      growthFactor: 50,
    }),
  }),
  deployTo: [env],
});

/* resource deployment alone is sufficient because we already have the
   corresponding resource handler tests to assert that resources can be
   used after created */

new IntegTest(app, 'appconfig-environment', {
  testCases: [stack],
});
