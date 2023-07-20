import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, SingleValueWidget, Metric } from 'aws-cdk-lib/aws-cloudwatch';

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dashboard');

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    const widget = new SingleValueWidget({
      metrics: [testMetric],
      period: Duration.minutes(10),
    });

    dashboard.addWidgets(widget);
  }
}
const app = new App();
const testCase = new TestStack(app, 'aws-cdk-cloudwatch-singlevaluewidget-period-integ');
new IntegTest(app, 'singlevaluewidget-with-period', {
  testCases: [testCase],
});
