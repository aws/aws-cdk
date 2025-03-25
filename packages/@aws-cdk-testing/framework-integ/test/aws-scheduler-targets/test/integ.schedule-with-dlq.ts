import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsSendMessage } from 'aws-cdk-lib/aws-scheduler-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-schedule-dlq');

const queue = new sqs.Queue(stack, 'ScheduleTargetQueue');
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const dlq = new sqs.Queue(stack, 'ScheduleDeadLetterQueue');
const payload = 'testing dlq';

const target = new SqsSendMessage(queue, {
  deadLetterQueue: dlq,
  role: role,
  input: scheduler.ScheduleTargetInput.fromText(payload),
});

// Deny execution role access to send messages to queue to force failed invocations
const denyPolicy = new iam.Policy(stack, 'DenySendMessagePolicy', {
  statements: [
    new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      effect: iam.Effect.DENY,
      resources: [queue.queueArn],
    }),
  ],
});

role.attachInlinePolicy(denyPolicy);

new scheduler.Schedule(stack, 'ScheduleToSendMessageToQueue', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  description: 'test description from the ScheduleToSendMessageToQueue',
  target,
});

const integ = new IntegTest(app, 'integtest-schedule-dlq', {
  testCases: [stack],
});

// Check that dead-letter queue received messages with matching target queue url
integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: dlq.queueUrl,
  MaxNumberOfMessages: 10,
}).expect(ExpectedResult.objectLike({
  Messages: Match.arrayWith([
    Match.objectLike({
      Body: Match.stringLikeRegexp(JSON.stringify({
        MessageBody: payload,
        QueueUrl: queue.queueUrl,
      })),
    }),
  ]),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(3),
  interval: cdk.Duration.seconds(20),
});
