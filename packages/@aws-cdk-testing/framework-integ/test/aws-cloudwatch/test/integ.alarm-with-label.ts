import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';

class AlarmWithLabelIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
      label: 'Metric [AVG: ${AVG}]',
    });

    new Alarm(this, 'Alarm1', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    testMetric.createAlarm(this, 'Alarm2', {
      threshold: 100,
      evaluationPeriods: 3,
    });
  }
}

const app = new App();

new IntegTest(app, 'cdk-cloudwatch-alarms-with-label-integ-test', {
  testCases: [new AlarmWithLabelIntegrationTest(app, 'AlarmWithLabelIntegrationTest')],
});
