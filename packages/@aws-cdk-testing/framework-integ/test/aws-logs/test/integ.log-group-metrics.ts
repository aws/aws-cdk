import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-log-group-metrics');

const logGroup = new LogGroup(stack, 'MyLogGroup', {
  logGroupName: 'my-log-group',
  removalPolicy: RemovalPolicy.DESTROY,
});

logGroup.metricIncomingBytes().createAlarm(stack, 'IncomingBytesPerInstanceAlarm', {
  threshold: 1,
  evaluationPeriods: 1,
});

logGroup.metricIncomingLogEvents().createAlarm(stack, 'IncomingEventsPerInstanceAlarm', {
  threshold: 1,
  evaluationPeriods: 1,
});

new IntegTest(app, 'LogGroupMetrics', {
  testCases: [stack],
});
