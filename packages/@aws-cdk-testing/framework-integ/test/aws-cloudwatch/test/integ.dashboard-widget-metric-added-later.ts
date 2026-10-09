import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'dashboard-widget-metric-added-later');

const dashboard = new cloudwatch.Dashboard(stack, 'Dashboard');

// The widget has no metrics when it is added to the dashboard; synth-time
// validation must only run after the metric below has been added.
const widget = new cloudwatch.GraphWidget({ title: 'Metric added later' });
dashboard.addWidgets(widget);
widget.addLeftMetric(new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'NumberOfMessagesSent',
  dimensionsMap: { QueueName: 'my-queue' },
}));

new integ.IntegTest(app, 'DashboardWidgetMetricAddedLater', {
  testCases: [stack],
});
