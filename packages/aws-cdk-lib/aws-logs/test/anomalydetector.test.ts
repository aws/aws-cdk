import { Template } from '../../assertions';
import { Stack } from '../../core';
import { LogGroup, LogAnomalyDetector, EvaluationFrequency } from '../lib'; // Adjust the import path as necessary

describe('LogAnomalyDetector', () => {
  test('basic instantiation', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'TestLogGroup');

    // WHEN
    new LogAnomalyDetector(stack, 'TestAnomalyDetector', {
      detectorName: 'TestDetector',
      evaluationFrequency: EvaluationFrequency.FIVE_MIN,
      filterPattern: 'ERROR',
      logGroupArnList: [logGroup.logGroupArn],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogAnomalyDetector', {
      DetectorName: 'TestDetector',
      EvaluationFrequency: 'FIVE_MIN',
      FilterPattern: 'ERROR',
      LogGroupArnList: [{ 'Fn::GetAtt': ['TestLogGroup4EEF7AD4', 'Arn'] }],
    });
  });

  test('anomaly detector with optional properties', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'TestLogGroup');

    // WHEN
    new LogAnomalyDetector(stack, 'TestAnomalyDetector', {
      detectorName: 'TestDetector',
      evaluationFrequency: EvaluationFrequency.ONE_HOUR,
      filterPattern: 'WARNING',
      anomalyVisibilityTime: 5,
      kmsKeyId: 'test-kms-key-id',
      logGroupArnList: [logGroup.logGroupArn],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogAnomalyDetector', {
      DetectorName: 'TestDetector',
      EvaluationFrequency: 'ONE_HOUR',
      FilterPattern: 'WARNING',
      AnomalyVisibilityTime: 5,
      KmsKeyId: 'test-kms-key-id',
      LogGroupArnList: [{ 'Fn::GetAtt': ['TestLogGroup4EEF7AD4', 'Arn'] }],
    });
  });

  test('addAnomalyDetector', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'TestLogGroup');

    // WHEN
    logGroup.addAnomalyDetector('TestAnomalyDetector', {
      detectorName: 'TestDetector',
      evaluationFrequency: EvaluationFrequency.FIVE_MIN,
      filterPattern: 'ERROR',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogAnomalyDetector', {
      DetectorName: 'TestDetector',
      EvaluationFrequency: 'FIVE_MIN',
      FilterPattern: 'ERROR',
    });
  });
});

