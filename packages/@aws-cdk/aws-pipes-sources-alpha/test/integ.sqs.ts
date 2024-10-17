import { randomUUID } from 'crypto';
import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsTarget } from '@aws-cdk/aws-pipes-targets-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SqsSource } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-sources-sqs');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

const sourceUnderTest = new SqsSource(sourceQueue, {
  batchSize: 10,
  maximumBatchingWindow: cdk.Duration.seconds(10),
});

new Pipe(stack, 'Pipe', {
  source: sourceUnderTest,
  target: new SqsTarget(targetQueue, {
    inputTransformation: InputTransformation.fromEventPath('$.body'),
  }),
});

const test = new IntegTest(app, 'integtest-pipe-source-sqs', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

const message = test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
});

message.assertAtPath('Messages.0.Body', ExpectedResult.stringLikeRegexp(uniqueIdentifier)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(15),
});

app.synth();
