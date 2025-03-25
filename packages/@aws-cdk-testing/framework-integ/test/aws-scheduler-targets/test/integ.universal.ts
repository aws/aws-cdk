import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Universal } from 'aws-cdk-lib/aws-scheduler-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'AwsSchedulerTargetsUniversal');

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new Universal({
    service: 'sqs',
    action: 'createQueue',
    input: scheduler.ScheduleTargetInput.fromObject({
      QueueName: 'aws-scheduler-targets-create-queue',
    }),
  }),
});

const integ = new IntegTest(app, 'IntegTestUniversal', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getQueueUrlAssertion = integ.assertions.awsApiCall('SQS', 'getQueueUrl', {
  QueueName: 'aws-scheduler-targets-create-queue',
}).assertAtPath('QueueUrl', ExpectedResult.stringLikeRegexp('https://.+'))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(2),
  });

const deleteQueueAssertion = integ.assertions.awsApiCall('SQS', 'deleteQueue', {
  QueueUrl: getQueueUrlAssertion.getAttString('QueueUrl'),
});

getQueueUrlAssertion.next(deleteQueueAssertion);
