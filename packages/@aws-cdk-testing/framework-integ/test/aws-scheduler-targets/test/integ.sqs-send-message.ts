import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsSendMessage } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * A message is sent to the queue by the scheduler every minute
 * The assertion checks that the expected payload in message is received by the queue
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-schedule');

const queue = new Queue(stack, 'MyQueue', {
  fifo: true,
  contentBasedDeduplication: true,
});
const payload = 'test';

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new SqsSendMessage(queue, {
    input: scheduler.ScheduleTargetInput.fromText(payload),
    messageGroupId: 'id',
  }),
});

const integ = new IntegTest(app, 'integ-sqs-send-message', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue.queueUrl,
});

// Verifies that expected message is received from the queue
message.assertAtPath(
  'Messages.0.Body',
  ExpectedResult.stringLikeRegexp(payload),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(3),
  interval: cdk.Duration.seconds(10),
});
