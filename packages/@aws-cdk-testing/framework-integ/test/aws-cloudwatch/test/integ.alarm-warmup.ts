import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudwatch-alarm-warmup');

const metric = new cloudwatch.Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

// Plain metric alarm that waits for the whole warm-up period
const metricAlarm = metric.createAlarm(stack, 'Alarm', {
  threshold: 100,
  evaluationPeriods: 3,
  warmUpConfiguration: {
    warmUpPeriod: cdk.Duration.minutes(60),
    onlyStartEvaluatingAfterWarmUpPeriodEnds: true,
  },
});

// Metric math alarm that may end warm-up early once the evaluation window is full
const mathAlarm = new cloudwatch.MathExpression({
  expression: 'm1 * 2',
  usingMetrics: { m1: metric },
}).createAlarm(stack, 'MathAlarm', {
  threshold: 200,
  evaluationPeriods: 2,
  warmUpConfiguration: {
    warmUpPeriod: cdk.Duration.minutes(30),
  },
});

// Metrics Insights query with GROUP BY (a multi-time-series alarm) with a warm-up period
const insightsAlarm = new cloudwatch.MathExpression({
  expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId) GROUP BY InstanceId ORDER BY AVG() DESC LIMIT 10',
  period: cdk.Duration.minutes(5),
}).createAlarm(stack, 'InsightsGroupByAlarm', {
  threshold: 80,
  evaluationPeriods: 1,
  warmUpConfiguration: {
    warmUpPeriod: cdk.Duration.minutes(15),
  },
});

// Anomaly detection alarm with a warm-up period
const anomalyAlarm = new cloudwatch.AnomalyDetectionAlarm(stack, 'AnomalyAlarm', {
  metric,
  evaluationPeriods: 2,
  warmUpConfiguration: {
    warmUpPeriod: cdk.Duration.minutes(60),
    onlyStartEvaluatingAfterWarmUpPeriodEnds: true,
  },
});

const integ = new IntegTest(app, 'AlarmWarmUpIntegTest', {
  testCases: [stack],
});

// CloudWatch accepted the warm-up configuration and put each brand new alarm into its warm-up period.
// (The assertion provider's SDK does not return the newer `WarmUpConfiguration` response member, so the
// evaluation state is what proves the configuration took effect.)
integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', { AlarmNames: [metricAlarm.alarmName] })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        StateValue: 'INSUFFICIENT_DATA',
        EvaluationState: 'IN_WARM_UP',
        StateReason: 'Alarm is in Warm-Up',
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', { AlarmNames: [mathAlarm.alarmName] })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        StateValue: 'INSUFFICIENT_DATA',
        EvaluationState: 'IN_WARM_UP',
        StateReason: 'Alarm is in Warm-Up',
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', { AlarmNames: [insightsAlarm.alarmName] })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        StateValue: 'INSUFFICIENT_DATA',
        EvaluationState: 'IN_WARM_UP',
        StateReason: 'Alarm is in Warm-Up',
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', { AlarmNames: [anomalyAlarm.alarmName] })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        ThresholdMetricId: 'expr_1',
        StateValue: 'INSUFFICIENT_DATA',
        EvaluationState: 'IN_WARM_UP',
        StateReason: 'Alarm is in Warm-Up',
      }),
    ]),
  }));
