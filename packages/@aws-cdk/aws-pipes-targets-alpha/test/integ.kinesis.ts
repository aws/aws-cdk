import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { KinesisTarget } from '../lib/kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-kinesis');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetStream = new cdk.aws_kinesis.Stream(stack, 'TargetStream');

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
