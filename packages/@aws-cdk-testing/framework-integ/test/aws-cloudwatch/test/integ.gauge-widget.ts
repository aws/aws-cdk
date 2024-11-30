import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'gauge-alarm');

const dashboard = new cloudwatch.Dashboard(stack, 'Dashboard');

const widget = new cloudwatch.GaugeWidget({
  title: 'My gauge widget',
  metrics: [new cloudwatch.Metric({
    namespace: 'AWS/VPN',
    metricName: 'TunnelState',
    dimensionsMap: {
      TunnelIpAddress: '123.123.123.123',
    },
    statistic: 'Minimum',
  })],
  leftYAxis: {
    min: 0,
    max: 10,
  },
  annotations: [
    {
      color: '#b2df8d',
      label: 'Up',
      value: 5,
      fill: cloudwatch.Shading.ABOVE,
    },
  ],
  statistic: 'Minimum',
  period: cdk.Duration.minutes(1),
});

dashboard.addWidgets(widget);

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});
