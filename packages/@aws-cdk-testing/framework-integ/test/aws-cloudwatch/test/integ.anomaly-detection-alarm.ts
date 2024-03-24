import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AnomalyDetectionAlarm, MathExpression, Metric } from 'aws-cdk-lib/aws-cloudwatch';

class AnomalyDetectionAlarmIntegrationTest extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    new AnomalyDetectionAlarm(this, 'Alarm', {
      evaluationPeriods: 5,
      threshold: 1,
      metric: new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
        usingMetrics: { ['m1']: testMetric },
      }),
    });
  }
}

class GeneratedAnomalyDetectionAlarmIntegrationTest extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    new AnomalyDetectionAlarm(this, 'Alarm', {
      generateAnomalyDetectionExpression: true,
      evaluationPeriods: 5,
      threshold: 1,
      metric: new MathExpression({
        expression: 'm1/2',
        usingMetrics: { ['m1']: testMetric },
      }),
    });
  }
}

const app = new App();

new IntegTest(app, 'cdk-cloudwatch-anomaly-detection-alarm-integ-test', {
  testCases: [
    new AnomalyDetectionAlarmIntegrationTest(app, 'AnomalyDetectionAlarmIntegrationTest'),
    new GeneratedAnomalyDetectionAlarmIntegrationTest(app, 'GeneratedAnomalyDetectionAlarmIntegrationTest'),
  ],
});