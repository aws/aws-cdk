import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, Metric, GraphWidget } from 'aws-cdk-lib/aws-cloudwatch';

class DashboardWithMetricIdAndVisibleIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dash');

    const widget = new GraphWidget({
      title: 'Metrics with id and visible properties',
      left: [
        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric1',
          label: 'Visible metric with custom ID',
          id: 'custom_metric_id',
          visible: true,
        }),

        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric2',
          label: 'Hidden metric for calculations',
          id: 'hidden_metric_id',
          visible: false,
        }),

        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric3',
          label: 'Metric with only ID',
          id: 'id_only_metric',
        }),

        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric4',
          label: 'Metric with only visible',
          visible: true,
        }),
      ],
      right: [
        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric5',
          label: 'Right side hidden metric',
          id: 'right_hidden_id',
          visible: false,
        }),
      ],
    });

    dashboard.addWidgets(widget);
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-with-metric-id-and-visible', {
  testCases: [new DashboardWithMetricIdAndVisibleIntegrationTest(app, 'DashboardWithMetricIdAndVisibleIntegrationTest')],
});
