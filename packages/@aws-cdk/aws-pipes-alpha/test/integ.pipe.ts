import { randomUUID } from 'crypto';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { DynamicInput, EnrichmentParametersConfig, IEnrichment, IPipe, ISource, ITarget, InputTransformation, Pipe, SourceConfig, TargetConfig } from '../lib';
import { name } from '../package.json';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

const enrichmentHandlerCode = 'exports.handler = async (event) => { return event.map( record => ({...record, body: `${record.body}-${record.name}-${record.static}` }) ) };';
const enrichmentLambda = new cdk.aws_lambda.Function(stack, 'EnrichmentLambda', {
  code: Code.fromInline(enrichmentHandlerCode),
  handler: 'index.handler',
  runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
});

// When this module is promoted from alpha, TestSource and TestTarget should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha and
// SqsTarget from @aws-cdk/aws-pipes-targets-alpha
if (!name.endsWith('-alpha')) {
  throw new Error('aws-pipes has exited alpha, TestSource and TestTarget should now be replaced with SqsSource and SqsTarget');
}

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

class TestEnrichment implements IEnrichment {
  enrichmentArn: string;

  inputTransformation: InputTransformation = InputTransformation.fromObject({
    body: DynamicInput.fromEventPath('$.body'),
    name: DynamicInput.pipeName,
    static: 'static',
  });
  constructor(private readonly lambda: cdk.aws_lambda.Function) {
    this.enrichmentArn = lambda.functionArn;
  }
  bind(pipe: IPipe): EnrichmentParametersConfig {
    return {
      enrichmentParameters: {
        inputTemplate: this.inputTransformation.bind(pipe).inputTemplate,
      },
    };
  }
  grantInvoke(pipeRole: cdk.aws_iam.IRole): void {
    this.lambda.grantInvoke(pipeRole);
  }
}

const pipe = new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: new TestSource(sourceQueue),
  target: new TestTarget(targetQueue),
  enrichment: new TestEnrichment(enrichmentLambda),
});

const test = new IntegTest(app, 'integtest-pipe-sqs-to-sqs', {
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
  Messages: [{ Body: uniqueIdentifier + '-' + pipe.pipeName + '-static' }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
  interval: cdk.Duration.seconds(15),
});

app.synth();
