import * as schedule from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SnsPublish } from '../lib/sns-publish';

/**
 * Stack verification steps:
 * 1. Messages are published to the SNS topic every minute
 * 2. The SQS queue subscribes the topic
 * 3. The assertion checks that the expected message is delivered to the queue by calling an api
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'AwsSchedulerTargetsSnsPublish');

const message = 'Hello, Scheduler!';

const topic = new sns.Topic(stack, 'Topic');

const queue = new sqs.Queue(stack, 'Queue');
topic.addSubscription(new subscriptions.SqsSubscription(queue, { rawMessageDelivery: true }));

new schedule.Schedule(stack, 'Schedule', {
  schedule: schedule.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new SnsPublish(topic, {
    input: schedule.ScheduleTargetInput.fromText(message),
  }),
});

const integ = new IntegTest(app, 'IntegTestSnsPublish', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const receiveMessage = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue.queueUrl,
});

receiveMessage.expect(ExpectedResult.objectLike({
  Messages: [
    {
      Body: `"${message}"`,
    },
  ],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
});
