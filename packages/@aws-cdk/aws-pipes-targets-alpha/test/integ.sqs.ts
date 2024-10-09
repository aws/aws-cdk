import { randomUUID } from 'crypto';
import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SqsTarget } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

new Pipe(stack, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: new SqsTarget(targetQueue,
    {
      inputTransformation: InputTransformation.fromEventPath('$.body'),
    }),
});

const test = new IntegTest(app, 'integtest-pipe-target-sqs', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage',
  {
    QueueUrl: targetQueue.queueUrl,
  })).expect(ExpectedResult.objectLike({
  Messages: [
    {
      Body: uniqueIdentifier,
    },
  ],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
});

app.synth();
