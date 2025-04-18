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
