import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'SnsToSqsStack');

const topic = new sns.Topic(stack, 'MyTopic');

const queue = new sqs.Queue(stack, 'MyQueue');

topic.addSubscription(new subs.SqsSubscription(queue, {
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
    store: sns.Filter.filter(sns.SubscriptionFilter.existsFilter()),
    event: sns.Filter.filter(sns.SubscriptionFilter.notExistsFilter()),
  },
  rawMessageDelivery: true,
}));

const integTest = new IntegTest(app, 'SNS Subscriptions', {
  testCases: [stack],
});

const message = JSON.stringify({ background: { color: 'green' }, price: 200, store: 'fans' });

integTest.assertions.awsApiCall('SNS', 'publish', {
  Message: message,
  TopicArn: topic.topicArn,
});

integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue.queueUrl,
  WaitTimeSeconds: 20,
}).expect(ExpectedResult.objectLike({
  Messages: [{ Body: message }],
}));
