import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cloudwatch from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'gauge-alarm');

const queue = new cdk.CfnResource(stack, 'queue', { type: 'AWS::SQS::Queue' });

const numberOfMessagesVisibleMetric = new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'ApproximateNumberOfMessagesVisible',
  dimensionsMap: { QueueName: queue.getAtt('QueueName').toString() },
});

const dashboard = new cloudwatch.Dashboard(stack, 'Dash', {
  dashboardName: 'MyCustomGaugeAlarm',
});
dashboard.addWidgets(
  new cloudwatch.GaugeWidget({
    leftYAxis: {
      max: 500,
      min: 0,
    },
    width: 24,
    metrics: [numberOfMessagesVisibleMetric],
  }),
);

new integ.IntegTest(app, 'GaugeAlarmIntegrationTest', {
  testCases: [stack],
});
