import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, SingleValueWidget, Metric, GraphWidget, GaugeWidget } from 'aws-cdk-lib/aws-cloudwatch';

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dashboard');

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
      account: '1234',
      region: 'us-north-5',
    });

    const singleValueWidget = new SingleValueWidget({
      metrics: [testMetric],
      start: '-P7D',
      end: '2018-12-17T06:00:00.000Z',
    });

    const graphWidget = new GraphWidget({
      left: [testMetric],
      start: '-P7D',
      end: '2018-12-17T06:00:00.000Z',
    });

    const gaugeWidget = new GaugeWidget({
      metrics: [testMetric],
      start: '-P7D',
      end: '2018-12-17T06:00:00.000Z',
    });

    dashboard.addWidgets(singleValueWidget);
    dashboard.addWidgets(graphWidget);
    dashboard.addWidgets(gaugeWidget);
  }
}
const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-and-widget-with-start-and-end', {
  testCases: [new TestStack(app, 'DashboardAndWidgetWithStartAndEnd')],
});
