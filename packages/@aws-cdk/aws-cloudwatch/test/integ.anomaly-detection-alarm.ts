import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'AnomalyDetectionAlarmIntegrationTest');

const testMetric = new cloudwatch.Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

const testMathExpression = new cloudwatch.MathExpression({
  expression: 'testMetric / 60',
  usingMetrics: {
    testMetric,
  },
});

new cloudwatch.AnomalyDetectionAlarm(stack, 'Alarm1', {
  metric: testMetric,
  threshold: 2,
  evaluationPeriods: 3,
});

new cloudwatch.AnomalyDetectionAlarm(stack, 'Alarm2', {
  metric: testMetric.with({
    statistic: 'p90',
  }),
  threshold: 3,
  evaluationPeriods: 5,

  actionsEnabled: false,
  alarmName: 'Alarm 2',
  alarmDescription: 'Alarm description 2',
  comparisonOperator: cloudwatch.AnomalyDetectionComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
  datapointsToAlarm: 3,
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
});

testMetric.createAnomalyDetectionAlarm(stack, 'Alarm3', {
  threshold: 2,
  evaluationPeriods: 3,
});

testMetric
  .with({ statistic: 'p90' })
  .createAnomalyDetectionAlarm(stack, 'Alarm4', {
    threshold: 3,
    evaluationPeriods: 5,

    actionsEnabled: false,
    alarmName: 'Alarm 4',
    alarmDescription: 'Alarm description 4',
    comparisonOperator: cloudwatch.AnomalyDetectionComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
    datapointsToAlarm: 3,
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  });

new cloudwatch.AnomalyDetectionAlarm(stack, 'Alarm5', {
  metric: testMathExpression,
  threshold: 2,
  evaluationPeriods: 3,
});


testMathExpression.createAnomalyDetectionAlarm(stack, 'Alarm6', {
  threshold: 2,
  evaluationPeriods: 3,
});

testMathExpression.createAnomalyDetectionAlarm(stack, 'Alarm7', {
  threshold: 2,
  evaluationPeriods: 5,

  actionsEnabled: false,
  alarmName: 'Alarm 7',
  alarmDescription: 'Alarm description 7',
  comparisonOperator: cloudwatch.AnomalyDetectionComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
  datapointsToAlarm: 3,
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
});

app.synth();
