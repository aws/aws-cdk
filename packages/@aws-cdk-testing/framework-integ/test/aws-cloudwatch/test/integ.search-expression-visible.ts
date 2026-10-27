import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, Metric, GraphWidget, SearchExpression } from 'aws-cdk-lib/aws-cloudwatch';

class SearchExpressionVisibleIntegrationTest extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const dashboard = new Dashboard(this, 'Dash');

    const invocations = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensionsMap: { FunctionName: 'test-function' },
      label: 'Invocations',
    });

    // A hidden search expression: its time series stay on the widget without
    // being rendered, so they can still be toggled on in the console.
    const allInvocations = new SearchExpression({
      expression: "SEARCH('{AWS/Lambda,FunctionName} MetricName=\"Invocations\"', 'Sum', 300)",
      label: 'All Lambda Invocations',
      visible: false,
    });

    dashboard.addWidgets(new GraphWidget({
      title: 'Invocations with hidden search expression',
      // `invocations` stays visible for contrast; `allInvocations` is hidden.
      left: [invocations, allInvocations],
    }));
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-search-expression-visible', {
  testCases: [new SearchExpressionVisibleIntegrationTest(app, 'SearchExpressionVisibleIntegrationTest')],
});
