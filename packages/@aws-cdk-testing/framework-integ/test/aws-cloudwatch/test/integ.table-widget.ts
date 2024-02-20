import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Color, TableThreshold } from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'TableWidget');

const dashboard = new cloudwatch.Dashboard(stack, 'Dashboard');

const widget = new cloudwatch.TableWidget({
  title: 'Table',
  metrics: [new cloudwatch.Metric({
    namespace: 'CDK/Test',
    metricName: 'Metric',
    statistic: 'Minimum',
  })],
  period: cdk.Duration.minutes(1),
  height: 12,
  width: 12,
  showUnitsInLabel: true,
  fullPrecision: true,
  layout: cloudwatch.TableLayout.HORIZONTAL,
  thresholds: [
    TableThreshold.above(1000, Color.RED),
    TableThreshold.between(500, 1000, Color.ORANGE),
    TableThreshold.below(500, Color.GREEN),
  ],
});

dashboard.addWidgets(widget);

new integ.IntegTest(app, 'TableWidgetTest', {
  testCases: [stack],
});
