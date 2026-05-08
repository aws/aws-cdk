import { App, Duration, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { PromQLAlarm } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'PromQLAlarmTestStack');

const basicAlarm = new PromQLAlarm(stack, 'BasicPromQLAlarm', {
  alarmName: 'BasicPromQLAlarm',
  alarmDescription: 'Test PromQL alarm',
  query: 'up == 0',
  evaluationInterval: Duration.seconds(60),
  pendingPeriod: Duration.seconds(300),
  recoveryPeriod: Duration.seconds(300),
});

const minimalAlarm = new PromQLAlarm(stack, 'MinimalPromQLAlarm', {
  alarmName: 'MinimalPromQLAlarm',
  query: 'cpu_usage > 90',
  evaluationInterval: Duration.seconds(30),
});

const integ = new IntegTest(app, 'PromQLAlarmIntegTest', {
  testCases: [stack],
});

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [basicAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        AlarmName: 'BasicPromQLAlarm',
        AlarmDescription: 'Test PromQL alarm',
        EvaluationInterval: 60,
        EvaluationCriteria: Match.objectLike({
          PromQLCriteria: Match.objectLike({
            Query: 'up == 0',
            PendingPeriod: 300,
            RecoveryPeriod: 300,
          }),
        }),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [minimalAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        AlarmName: 'MinimalPromQLAlarm',
        EvaluationInterval: 30,
        EvaluationCriteria: Match.objectLike({
          PromQLCriteria: Match.objectLike({
            Query: 'cpu_usage > 90',
          }),
        }),
      }),
    ]),
  }));
