import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, GraphWidget, Metric, Shading, Stats, VerticalShading } from 'aws-cdk-lib/aws-cloudwatch';

class DashboardWithGraphWidgetWithAnnotationsIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dash');

    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric',
          label: 'Metric left 1 - p99',
          statistic: Stats.p(99),
        }),

        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric',
          label: 'Metric left 2 - TC_10P_90P',
          statistic: Stats.tc(10, 90),
        }),

        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric',
          label: 'Metric left 3 - TS(5%:95%)',
          statistic: 'TS(5%:95%)',
        }),
      ],
      right: [
        new Metric({
          namespace: 'CDK/Test',
          metricName: 'Metric',
          label: 'Metric right 1 - p90.1234',
          statistic: 'p90.1234',
        }),
      ],
      leftAnnotations: [
        {
          value: 10,
          label: 'Left annotation',
          color: '#00ff00',
          fill: Shading.ABOVE,
          visible: true,
        },
      ],
      rightAnnotations: [
        {
          value: 20,
          label: 'Right annotation',
          color: '#e30d0d',
          fill: Shading.BELOW,
          visible: false,
        },
      ],
      verticalAnnotations: [
        {
          date: '2023-08-20T00:00:00.000Z',
          label: 'Vertical annotation',
          color: '#2556f6',
          fill: VerticalShading.AFTER,
          visible: true,
        },
      ],
    });

    dashboard.addWidgets(widget);
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-with-graph-widget-with-annotations', {
  testCases: [new DashboardWithGraphWidgetWithAnnotationsIntegrationTest(app, 'DashboardWithGraphWidgetWithAnnotationsIntegrationTest')],
});
