import { randomUUID } from 'crypto';
import { ITarget, Pipe, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { KinesisSource, KinesisStartingPosition, OnPartialBatchItemFailure } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-sources-kinesis');
const sourceKinesisStream = new cdk.aws_kinesis.Stream(stack, 'SourceKinesisStream');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

class TestTarget implements ITarget {
  targetArn: string;

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
  }

  bind(_pipe: Pipe): TargetConfig {
    return {
      targetParameters: {},
    };
  }

  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

const sourceUnderTest = new KinesisSource(sourceKinesisStream, {
  batchSize: 1,
  maximumBatchingWindow: cdk.Duration.seconds(20),
  maximumRecordAge: cdk.Duration.seconds(60),
  maximumRetryAttempts: 3,
  onPartialBatchItemFailure: OnPartialBatchItemFailure.AUTOMATIC_BISECT,
  parallelizationFactor: 1,
  startingPosition: KinesisStartingPosition.LATEST,
  startingPositionTimestamp: 1711576897,
});

new Pipe(stack, 'Pipe', {
  source: sourceUnderTest,
  target: new TestTarget(targetQueue),
});

const test = new IntegTest(app, 'integtest-pipe-source-kinesis', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
const base64UniqueIdentifier = Buffer.from(uniqueIdentifier, 'utf-8').toString('base64');

test.assertions.awsApiCall('Kinesis', 'putRecord', {
  StreamARN: sourceKinesisStream.streamArn,
  Data: uniqueIdentifier,
  PartitionKey: '1',
});

const message = test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
});

// data is base64 encoded
message.assertAtPath('Messages.0.Body.data', ExpectedResult.stringLikeRegexp(base64UniqueIdentifier)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(15),
});

app.synth();
