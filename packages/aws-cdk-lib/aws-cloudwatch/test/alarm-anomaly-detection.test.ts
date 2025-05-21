import { Construct } from 'constructs';
import { Match, Template, Annotations } from '../../assertions';
import { Duration, Stack } from '../../core';
import { Alarm, AnomalyDetectionAlarm, ComparisonOperator, CfnAlarm, Metric, MathExpression, TreatMissingData } from '../lib';

describe('AnomalyDetectionAlarm', () => {
  let stack: Stack;
  let metric: Metric;

  beforeEach(() => {
    stack = new Stack();
    metric = new Metric({
      namespace: 'AWS/EC2',
      metricName: 'CPUUtilization',
    });
  });

  // Helper to create a complex metric for testing
  function createComplexMetric(): MathExpression {
    const metric1 = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });
    const metric2 = new Metric({ namespace: 'AWS/EC2', metricName: 'NetworkIn' });

    return new MathExpression({
      expression: 'm1 + m2',
      usingMetrics: { m1: metric1, m2: metric2 },
    });
  }

  describe('Creation', () => {
    test('can create with default settings', () => {
      // WHEN
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric,
        evaluationPeriods: 3,
        // No comparisonOperator specified - should use default
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
        EvaluationPeriods: 3,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 2)',
            Id: 'expr_1',
            ReturnData: true,
          }),
          Match.objectLike({
            Id: 'm0',
            ReturnData: true,
          }),
        ]),
      });
    });

    test('can create with custom settings', () => {
      // WHEN
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric,
        stdDevs: 3,
        evaluationPeriods: 2,
        datapointsToAlarm: 2,
        comparisonOperator: ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
        treatMissingData: TreatMissingData.BREACHING,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanUpperThreshold',
        EvaluationPeriods: 2,
        DatapointsToAlarm: 2,
        ThresholdMetricId: 'expr_1',
        TreatMissingData: 'breaching',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 3)',
            Id: 'expr_1',
          }),
        ]),
      });
    });
  });

  describe('Validation', () => {
    test('throws error for non-anomaly detection operators', () => {
      // WHEN/THEN
      expect(() => {
        new AnomalyDetectionAlarm(stack, 'Alarm', {
          metric,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        });
      }).toThrow(/Fixed threshold operator GreaterThanThreshold can not be used/);
    });

    test('throws error for invalid stdDevs value', () => {
      // WHEN/THEN
      expect(() => {
        new AnomalyDetectionAlarm(stack, 'Alarm', {
          metric,
          stdDevs: -1,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        });
      }).toThrow(/stdDevs must be greater than 0/);
    });
  });

  describe('Behavior', () => {
    test('correctly sets up anomaly detection band', () => {
      // WHEN
      const alarm = new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric,
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudWatch::Alarm', {
        Threshold: Match.absent(),
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayEquals([
          Match.objectLike({
            Expression: Match.stringLikeRegexp('ANOMALY_DETECTION_BAND'),
            Id: 'expr_1',
            ReturnData: true,
          }),
          Match.anyValue(),
        ]),
      });
    });

    test('works with complex metric compositions', () => {
      // GIVEN
      const combinedMetric = createComplexMetric();

      // WHEN
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: combinedMetric,
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: Match.stringLikeRegexp('ANOMALY_DETECTION_BAND'),
            ReturnData: true,
          }),
          Match.objectLike({
            Expression: 'm1 + m2',
            ReturnData: true,
          }),
        ]),
      });
    });
  });

  describe('Error Cases', () => {
    test('Alarm rejects anomaly detection operators', () => {
      // WHEN/THEN
      expect(() => {
        new Alarm(stack, 'Alarm', {
          metric,
          threshold: 100,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        });
      }).toThrow(/Anomaly detection operator LessThanLowerOrGreaterThanUpperThreshold requires an/);
    });
  });
});
