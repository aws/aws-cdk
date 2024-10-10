import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { KinesisTarget } from '../lib/kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-kinesis');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetStream = new cdk.aws_kinesis.Stream(stack, 'TargetStream');

new Pipe(stack, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: new KinesisTarget(targetStream, {
    partitionKey: 'pk',
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-kinesis', {
  testCases: [stack],
});

const body = 'OmahaNebraska';
test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: body,
});

// It is nontrivial to read from a Kinesis data stream.
// Manual verification was done to ensure the record made
// it from SQS to Kinesis via the pipe.

app.synth();
