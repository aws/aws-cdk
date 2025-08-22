import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'sns-sqs-subscription-filter');

const topic = new sns.Topic(stack, 'MyTopic');

const queue1 = new sqs.Queue(stack, 'MyQueue1');
const queue2 = new sqs.Queue(stack, 'MyQueue2');

topic.addSubscription(new subs.SqsSubscription(queue1, {
  filterPolicyWithMessageBody: {
    background: sns.Policy.policy({
      color: sns.Filter.filter(sns.SubscriptionFilter.stringFilter({
        allowlist: ['red', 'green'],
      })),
    }),
    price: sns.Filter.filter(sns.SubscriptionFilter.numericFilter({
      allowlist: [100, 200],
    })),
    store: sns.Filter.filter(sns.SubscriptionFilter.existsFilter()),
  },
  rawMessageDelivery: true,
}));

topic.addSubscription(new subs.SqsSubscription(queue2, {
  filterPolicyWithMessageBody: {
    background: sns.Policy.policy({
      color: sns.Filter.filter(sns.SubscriptionFilter.stringFilter({
        denylist: ['red', 'green'],
      })),
    }),
    price: sns.Filter.filter(sns.SubscriptionFilter.numericFilter({
      betweenStrict: { start: 100, stop: 200 },
    })),
    store: sns.Filter.filter(sns.SubscriptionFilter.notExistsFilter()),
  },
  rawMessageDelivery: true,
}));

const integTest = new IntegTest(app, 'SNS Subscription filters', {
  testCases: [stack],
});

const message1 = JSON.stringify({ background: { color: 'green' }, price: 200, store: 'fans' }); // matches queue1 subscription filter
const message2 = JSON.stringify({ background: { color: 'blue' }, price: 150 }); // matches queue2 subscription filter

// publish messages to SNS topic
integTest.assertions.awsApiCall('SNS', 'publish', {
  Message: message1,
  TopicArn: topic.topicArn,
});
integTest.assertions.awsApiCall('SNS', 'publish', {
  Message: message2,
  TopicArn: topic.topicArn,
});

// check messages arrived at expected destination queue
integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue1.queueUrl,
  WaitTimeSeconds: 20,
}).expect(ExpectedResult.objectLike({
  Messages: [{ Body: message1 }],
}));
integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue2.queueUrl,
  WaitTimeSeconds: 20,
}).expect(ExpectedResult.objectLike({
  Messages: [{ Body: message2 }],
}));
