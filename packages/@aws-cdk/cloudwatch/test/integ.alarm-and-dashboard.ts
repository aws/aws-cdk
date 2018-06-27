// Integration test to deploy some resources, create an alarm on it and create a dashboard.
//
// Because literally every other library is going to depend on @aws-cdk/cloudwatch, we drop down
// to the very lowest level to create CloudFormation resources by hand, without even generated
// library support.

import { App, Resource, Stack } from '@aws-cdk/core';
import { AlarmWidget, Dashboard, Metric } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, `aws-cdk-cloudwatch`);

const queue = new Resource(stack, 'queue', { type: 'AWS::SQS::Queue' });

const metric = new Metric({
    namespace: 'AWS/SQS',
    metricName: 'ApproximateNumberOfMessagesVisible',
    dimensions: { QueueName: queue.getAtt('QueueName') }
});

const alarm = metric.newAlarm(stack, 'Alarm', {
    threshold: 100,
    evaluationPeriods: 3
});

const dashboard = new Dashboard(stack, 'Dash');
dashboard.add(new AlarmWidget({
    title: 'Messages in queue',
    alarm,
}));

process.stdout.write(app.run());
