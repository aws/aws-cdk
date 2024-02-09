import { randomUUID } from 'crypto';
import { ITarget, InputTransformation, Pipe, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SqsSource } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-sources-sqs');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

class TestTarget implements ITarget {
  targetArn: string;
  inputTransformation: InputTransformation = InputTransformation.fromEventPath('$.body');

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
  }

  bind(_pipe: Pipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTransformation.bind(_pipe).inputTemplate,
      },
    };
  }

  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

const sourceUnderTest = new SqsSource(sourceQueue, {
  batchSize: 10,
  maximumBatchingWindow: cdk.Duration.seconds(10),
});

new Pipe(stack, 'Pipe', {
  source: sourceUnderTest,
  target: new TestTarget(targetQueue),
});

const test = new IntegTest(app, 'integtest-pipe-source-sqs', {
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

