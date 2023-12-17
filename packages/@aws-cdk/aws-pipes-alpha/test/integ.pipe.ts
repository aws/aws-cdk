import { randomUUID } from 'crypto';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Pipe } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: {
    grantRead: (role) => sourceQueue.grantConsumeMessages(role),
    sourceArn: sourceQueue.queueArn,
    sourceParameters: {},
  },
  target: {
    grantPush: (role) => targetQueue.grantSendMessages(role),
    targetArn: targetQueue.queueArn,
    targetParameters: {
      inputTemplate: '<$.body>',
    },
  },
});

const test = new IntegTest(app, 'integtest-schedule', {
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
  totalTimeout: cdk.Duration.seconds(20),
});

app.synth();
