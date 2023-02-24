import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import * as subs from '../lib';
class SnsToSqsStack extends cdk.Stack {
  topic: sns.Topic;
  queue: sqs.Queue;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.topic = new sns.Topic(this, 'MyTopic');
    const queueStack = new cdk.Stack(app, 'QueueStack');
    this.queue = new sqs.Queue(queueStack, 'MyQueue');
    this.topic.addSubscription(new subs.SqsSubscription(this.queue, {
      filterPolicyWithMessageBody: {
        background: sns.Policy.policy({
          color: sns.Filter.filter(sns.SubscriptionFilter.stringFilter({
            allowlist: ['red', 'green'],
            denylist: ['white', 'orange'],
          })),
        }),
        price: sns.Filter.filter(sns.SubscriptionFilter.numericFilter({
          allowlist: [100, 200],
          between: { start: 300, stop: 350 },
          greaterThan: 500,
          lessThan: 1000,
          betweenStrict: { start: 2000, stop: 3000 },
        })),
      },
    }));
  }
}
// Beginning of the test suite
const app = new cdk.App();
const stack = new SnsToSqsStack(app, 'SnsToSqsStack');
const integTest = new IntegTest(app, 'SNS Subscriptions', {
  testCases: [
    stack,
  ],
});
integTest.assertions.awsApiCall('SNS', 'publish', {
  Message: '{ background: { color: \'green\' }, price: 200 }',
  TopicArn: stack.topic.topicArn,
});
const message = integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
  WaitTimeSeconds: 20,
});
message.expect(ExpectedResult.objectLike({
  Messages: [{ Body: '{color: "green", price: 200}' }],
}));
app.synth();