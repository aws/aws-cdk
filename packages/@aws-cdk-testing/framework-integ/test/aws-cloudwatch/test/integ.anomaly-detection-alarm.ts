import { App, Stack, Duration } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Metric, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'AnomalyDetectionAlarmTestStack');

// Create the test metric
const metric = new Metric({
  namespace: 'AWS/EC2',
  metricName: 'CPUUtilization',
  statistic: 'Average',
  period: Duration.minutes(5),
});

// Create an anomaly detection alarm with default operator
const defaultOperatorAlarm = metric.createAnomalyDetectionAlarm(stack, 'DefaultOperatorAnomalyAlarm', {
  stdDevs: 2,
  evaluationPeriods: 3,
  datapointsToAlarm: 2,
});

// Create an anomaly detection alarm with explicit operator
const explicitOperatorAlarm = metric.createAnomalyDetectionAlarm(stack, 'ExplicitOperatorAnomalyAlarm', {
  stdDevs: 3,
  evaluationPeriods: 2,
  comparisonOperator: ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
});

// Create an anomaly detection alarm with custom description
const descriptiveAlarm = metric.createAnomalyDetectionAlarm(stack, 'DescriptiveAnomalyAlarm', {
  stdDevs: 2.5,
  evaluationPeriods: 3,
  alarmDescription: 'Alarm when CPU utilization is outside the expected band',
  comparisonOperator: ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
});

// Create the integration test
const integ = new IntegTest(app, 'AnomalyDetectionAlarmIntegTest', {
  testCases: [stack],
});

// Add assertions for each alarm
integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [defaultOperatorAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
        EvaluationPeriods: 3,
        DatapointsToAlarm: 2,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          // Verify the anomaly detection band
          Match.objectLike({
            Id: 'expr_1',
            Expression: 'ANOMALY_DETECTION_BAND(m0, 2)',
            ReturnData: true,
          }),
          // Verify the base metric configuration
          Match.objectLike({
            Id: 'm0',
            MetricStat: Match.objectLike({
              Metric: Match.objectLike({
                Namespace: 'AWS/EC2',
                MetricName: 'CPUUtilization',
              }),
              Period: 300, // 5 minutes in seconds
              Stat: 'Average',
            }),
            ReturnData: true,
          }),
        ]),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [explicitOperatorAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        ComparisonOperator: 'GreaterThanUpperThreshold',
        EvaluationPeriods: 2,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 3)',
            ReturnData: true,
          }),
        ]),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [descriptiveAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        AlarmDescription: 'Alarm when CPU utilization is outside the expected band',
        ComparisonOperator: 'GreaterThanUpperThreshold',
        EvaluationPeriods: 3,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 2.5)',
            ReturnData: true,
          }),
        ]),
      }),
    ]),
  }));
