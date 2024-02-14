import { randomUUID } from 'crypto';
import { IPipe, ISource, InputTransformation, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SqsTarget } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

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
