import * as schedule from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Universal } from '../lib/universal';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'AwsSchedulerTargetsUniversal');

new schedule.Schedule(stack, 'Schedule', {
  schedule: schedule.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new Universal({
    service: 'sqs',
    action: 'createQueue',
    input: schedule.ScheduleTargetInput.fromObject({
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
