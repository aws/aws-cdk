import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { PromQLAlarm } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'PromQLAlarmTestStack');

new PromQLAlarm(stack, 'BasicPromQLAlarm', {
  alarmName: 'BasicPromQLAlarm',
  alarmDescription: 'Test PromQL alarm',
  query: 'up == 0',
  evaluationInterval: Duration.seconds(60),
  pendingPeriod: Duration.seconds(300),
  recoveryPeriod: Duration.seconds(300),
});

new PromQLAlarm(stack, 'MinimalPromQLAlarm', {
  query: 'cpu_usage > 90',
  evaluationInterval: Duration.seconds(30),
});

new IntegTest(app, 'PromQLAlarmIntegTest', {
  testCases: [stack],
});
