import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'SnsToSqsStack');

const topic = new sns.Topic(stack, 'MyTopic');

const queue = new sqs.Queue(stack, 'MyQueue');

topic.addSubscription(new subs.SqsSubscription(queue, { rawMessageDelivery: true }));

const integTest = new IntegTest(app, 'SNS Subscriptions', {
  testCases: [stack],
});

const message = JSON.stringify({ color: 'green', price: 200 });

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
