import { App, Stack, StackProps } from 'aws-cdk-lib';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import { Dashboard, GraphWidget } from 'aws-cdk-lib/aws-cloudwatch';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class ExposeMetricWithDimensions extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup');

    // Create a metric filter with dimensions
    const mf = new MetricFilter(this, 'MetricFilter', {
      logGroup,
      metricName: 'testName',
      metricNamespace: 'testNamespace',
      filterPattern: FilterPattern.exists('$.latency'),
      metricValue: '$.latency',
      dimensions: {
        Foo: 'Bar',
        Bar: 'Baz',
      },
    });

    // Expose the metric with dimensions
    const metric = mf.metric();

    new Dashboard(this, 'Dashboard', {
      dashboardName: 'ExposeMetricWithDimensionsDashboard',
      widgets: [[
        new GraphWidget({
          title: 'Latency with Dimensions',
          left: [metric],
        }),
      ]],
    });
  }
}

const app = new App();
const stack = new ExposeMetricWithDimensions(app, 'aws-cdk-expose-metric-with-dimensions-integ');

new IntegTest(stack, 'ExposeMetricWithDimensionsTest', {
  testCases: [stack],
});

app.synth();
