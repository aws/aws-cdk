import { InputTransformation, IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { FirehoseTarget } from '../lib';

/*
 * This integration test sends a message to an SQS queue and validates
 * that the message is published to a Firehose stream. There is an S3
 * bucket that serves as the Firehose destination.
 *
 * SQS (pipe source) --> Firehose (pipe target) --> S3
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-firehose');

const bucket = new cdk.aws_s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetStream = new cdk.aws_kinesisfirehose.DeliveryStream(stack, 'TargetStream', {
  destination: new cdk.aws_kinesisfirehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(0),
  }),
});

// When this module is promoted from alpha, TestSource should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha
class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new FirehoseTarget(targetStream,
    {
      inputTransformation: InputTransformation.fromEventPath('$.body'),
    }),
});

const test = new IntegTest(app, 'integtest-pipe-target-firehose', {
  testCases: [stack],
});

const uniqueIdentifier = 'nebraska';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

// Check that the message made it through the pipe and landed in S3
const objects = putMessageOnQueue.next(test.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(60),
  totalTimeout: cdk.Duration.minutes(5),
}));

if (objects instanceof AwsApiCall && objects.waiterProvider) {
  objects.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

app.synth();
