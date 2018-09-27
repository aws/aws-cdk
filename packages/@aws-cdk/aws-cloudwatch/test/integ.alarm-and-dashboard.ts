// Integration test to deploy some resources, create an alarm on it and create a dashboard.
//
// Because literally every other library is going to depend on @aws-cdk/aws-cloudwatch, we drop down
// to the very lowest level to create CloudFormation resources by hand, without even generated
// library support.

import cdk = require('@aws-cdk/cdk');
import cloudwatch = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, `aws-cdk-cloudwatch`);

const queue = new cdk.Resource(stack, 'queue', { type: 'AWS::SQS::Queue' });

const metric = new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'ApproximateNumberOfMessagesVisible',
  dimensions: { QueueName: queue.getAtt('QueueName') }
});

const alarm = metric.newAlarm(stack, 'Alarm', {
  threshold: 100,
  evaluationPeriods: 3
});

const dashboard = new cloudwatch.Dashboard(stack, 'Dash');
dashboard.add(
  new cloudwatch.TextWidget({ markdown: '# This is my dashboard' }),
  new cloudwatch.TextWidget({ markdown: 'you like?' }),
);
dashboard.add(new cloudwatch.AlarmWidget({
  title: 'Messages in queue',
  alarm,
}));
dashboard.add(new cloudwatch.GraphWidget({
  title: 'More messages in queue with alarm annotation',
  left: [metric],
  leftAnnotations: [alarm.toAnnotation()]
}));
dashboard.add(new cloudwatch.SingleValueWidget({
  title: 'Current messages in queue',
  metrics: [metric]
}));

process.stdout.write(app.run());
