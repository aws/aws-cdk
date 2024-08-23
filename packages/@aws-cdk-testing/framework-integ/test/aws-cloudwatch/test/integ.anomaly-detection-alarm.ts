import { App, Stack, Duration } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Metric, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';

class AnomalyDetectionAlarmTestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const metric = new Metric({
      namespace: 'AWS/EC2',
      metricName: 'CPUUtilization',
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    metric.createAnomalyDetectionAlarm(this, 'AnomalyAlarm', {
      bounds: 2,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
    });
  }
}

const app = new App();

new IntegTest(app, 'AnomalyDetectionAlarmIntegTest', {
  testCases: [new AnomalyDetectionAlarmTestStack(app, 'AnomalyDetectionAlarmTestStack')],
});

// app.synth();

/**
 * Integration test for anomaly detection alarms
 *
 * SYNTHESIS VERIFICATION:
 * 1. Check for the presence of ANOMALY_DETECTION_BAND in the template
 *    - The Metrics property should contain an item with Expression: "ANOMALY_DETECTION_BAND(m1, 2)"
 * 2. Verify that ThresholdMetricId is set and Threshold is not present
 *    - The Alarm resource should have a ThresholdMetricId property set to "expr_1"
 *    - The Alarm resource should not have a Threshold property
 * 3. Ensure both metrics have ReturnData set to true
 *    - Both items in the Metrics array should have "ReturnData": true
 */