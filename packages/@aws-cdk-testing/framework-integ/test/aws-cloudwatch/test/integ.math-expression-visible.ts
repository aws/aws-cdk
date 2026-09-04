import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, Metric, GraphWidget, MathExpression } from 'aws-cdk-lib/aws-cloudwatch';

class MathExpressionVisibleIntegrationTest extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const dashboard = new Dashboard(this, 'Dash');

    const invocations = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Invocations',
    });

    const errors = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Errors',
    });

    // A hidden math expression: computed but not plotted on the graph.
    const errorRate = new MathExpression({
      expression: 'errors / invocations * 100',
      usingMetrics: {
        errors,
        invocations,
      },
      label: 'Error Rate (%)',
      visible: false,
    });

    dashboard.addWidgets(new GraphWidget({
      title: 'Invocations with hidden error rate expression',
      // `invocations` stays visible for contrast; `errorRate` is hidden.
      left: [invocations, errorRate],
    }));
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-math-expression-visible', {
  testCases: [new MathExpressionVisibleIntegrationTest(app, 'MathExpressionVisibleIntegrationTest')],
});
