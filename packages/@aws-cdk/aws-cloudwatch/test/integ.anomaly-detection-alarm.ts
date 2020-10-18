import { App, Stack, StackProps } from '@aws-cdk/core';
import { Alarm, ComparisonOperator, MathExpression, Metric } from '../lib';

class AnomalyDetectionAlarmIntegrationTest extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    new Alarm(this, 'Alarm', {
      comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      evaluationPeriods: 1,
      metric: new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(testMetric, 2)',
        usingMetrics: { testMetric },
      }),
    });
  }
}

const app = new App();

new AnomalyDetectionAlarmIntegrationTest(app, 'AnomalyDetectionAlarmIntegrationTest');

app.synth();