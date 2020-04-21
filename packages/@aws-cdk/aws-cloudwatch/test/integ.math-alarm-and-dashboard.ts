// Integration test to deploy some resources, create an alarm on it and create a dashboard.
//
// Because literally every other library is going to depend on @aws-cdk/aws-cloudwatch, we drop down
// to the very lowest level to create CloudFormation resources by hand, without even generated
// library support.

import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudwatch');

const queue = new cdk.CfnResource(stack, 'queue', { type: 'AWS::SQS::Queue' });

const metricA = new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'ApproximateNumberOfMessagesVisible',
  dimensions: { QueueName: queue.getAtt('QueueName') },
  period: cdk.Duration.seconds(10),
  label: 'Visible Messages',
});

const metricB = new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'ApproximateNumberOfMessagesNotVisible',
  dimensions: { QueueName: queue.getAtt('QueueName') },
  period: cdk.Duration.seconds(30),
  label: 'NotVisible Messages',
});

const sumExpression = new cloudwatch.MathExpression({
  expression: 'm1+m2',
  usingMetrics: {
    m1: metricA,
    m2: metricB,
  },
  label: 'Total Messages',
  period: cdk.Duration.minutes(1),
});

const alarm = sumExpression.createAlarm(stack, 'Alarm', {
  threshold: 100,
  evaluationPeriods: 3,
});

const dashboard = new cloudwatch.Dashboard(stack, 'Dash', {
  dashboardName: 'MyMathExpressionDashboardName',
});
dashboard.addWidgets(new cloudwatch.AlarmWidget({
  title: 'Total messages in queue',
  alarm,
}));

dashboard.addWidgets(new cloudwatch.GraphWidget({
  title: 'More total messages in queue with alarm annotation',
  left: [sumExpression],
  right: [metricA, metricB],
  leftAnnotations: [alarm.toAnnotation()],
}));

dashboard.addWidgets(new cloudwatch.SingleValueWidget({
  title: 'Current total messages in queue',
  metrics: [sumExpression],
}));

app.synth();
