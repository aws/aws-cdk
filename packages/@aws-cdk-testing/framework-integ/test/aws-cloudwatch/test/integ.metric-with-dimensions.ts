// Creates an Alarm with a Metric that contains 11 dimensions
// 1 valid dimension used, with 10 blank ones since it's hard to find a resource with more than 5 dimensions that is feasable to run tests with
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudwatch-metric-dimensions');

const queue = new cdk.CfnResource(stack, 'queue', { type: 'AWS::SQS::Queue' });

const numberOfMessagesVisibleMetric = new cloudwatch.Metric({
  namespace: 'AWS/SQS',
  metricName: 'ApproximateNumberOfMessagesVisible',
  dimensionsMap: {
    QueueName: queue.getAtt('QueueName').toString(),
    BlankD1: 'value1',
    BlankD2: 'value2',
    BlankD3: 'value3',
    BlankD4: 'value4',
    BlankD5: 'value5',
    BlankD6: 'value6',
    BlankD7: 'value7',
    BlankD8: 'value8',
    BlankD9: 'value9',
    BlankD10: 'value10',
  },
});

numberOfMessagesVisibleMetric.createAlarm(stack, 'Alarm', {
  threshold: 100,
  evaluationPeriods: 3,
  datapointsToAlarm: 2,
});

new IntegTest(app, 'metric-with-dimensions-test', {
  testCases: [stack],
});
