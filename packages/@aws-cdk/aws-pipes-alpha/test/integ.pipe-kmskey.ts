import { randomUUID } from 'crypto';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { InputTransformation, IPipe, ISource, ITarget, Pipe, SourceConfig, TargetConfig } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PipesKmsKeyTestStack');
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

new Pipe(stack, 'Pipe', {
  pipeName: 'CmkPipe',
  source: new TestSource(sourceQueue),
  target: new TestTarget(targetQueue),
  kmsKey: new Key(stack, 'KmsKey', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  }),
});

const test = new IntegTest(app, 'PipesKmsKeyTest', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
})).expect(ExpectedResult.objectLike({
  Messages: [{ Body: uniqueIdentifier }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
  interval: cdk.Duration.seconds(15),
});
