import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, Metric, GraphWidget, MathExpression } from 'aws-cdk-lib/aws-cloudwatch';

class DashboardWithMetricIdAndVisibleIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dash');

    const lambdaInvocations = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Lambda Invocations',
      id: 'lambda_invocations',
      visible: true,
    });

    const lambdaErrors = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Lambda Errors (Hidden for calculation)',
      id: 'lambda_errors',
      visible: false,
    });

    const lambdaDuration = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Duration',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Lambda Duration',
      id: 'lambda_duration',
      visible: true,
    });

    const lambdaThrottles = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Throttles',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Lambda Throttles (Hidden)',
      id: 'lambda_throttles',
      visible: false,
    });

    const errorRate = new MathExpression({
      expression: 'lambda_errors / lambda_invocations * 100',
      label: 'Error Rate (%)',
    });

    const widget = new GraphWidget({
      title: 'Lambda Metrics with ID and Visible Properties',
      left: [
        lambdaInvocations,
        lambdaErrors,
        lambdaDuration,
        lambdaThrottles,
        errorRate,
      ],
    });

    dashboard.addWidgets(widget);
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-with-metric-id-and-visible', {
  testCases: [new DashboardWithMetricIdAndVisibleIntegrationTest(app, 'DashboardWithMetricIdAndVisibleIntegrationTest')],
});
