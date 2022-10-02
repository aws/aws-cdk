import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Dashboard, SingleValueWidget, Metric } from '../lib';

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
      sparkline: true,
    });

    dashboard.addWidgets(widget);
  }
}
const app = new App();
const testCase = new TestStack(app, 'aws-cdk-cloudwatch-singlevaluewidget-sparkline-integ');
new IntegTest(app, 'singlevaluewidget-with-sparkline', {
  testCases: [testCase],
});
