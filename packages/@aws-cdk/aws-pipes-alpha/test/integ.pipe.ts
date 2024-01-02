import { randomUUID } from 'crypto';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { EnrichmentParameters as EnrichmentParameters, IEnrichment, ILogDestination, ISource, ITarget, IncludeExecutionData, LogDestinationParameters, LogLevel, Pipe, TargetParameters } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

const enrichmentHandlerCode = 'exports.handler = async (event) => { return event.map( record => ({...record, body: record.body + "-enriched"}) ) };';
const enrichmentLambda = new cdk.aws_lambda.Function(stack, 'EnrichmentLambda', {
  code: Code.fromInline(enrichmentHandlerCode),
  handler: 'index.handler',
  runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
});

const loggroup = new cdk.aws_logs.LogGroup(stack, 'LogGroup');

class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

class TestTarget implements ITarget {
  targetArn: string;
  targetParameters: TargetParameters;

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
    this.targetParameters = {
      inputTransformation: { inputTemplate: '<$.body>' },
    };
  }

  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

class TestEnrichment implements IEnrichment {
  enrichmentArn: string;
  enrichmentParameters: EnrichmentParameters;
  constructor(private readonly lambda: cdk.aws_lambda.Function) {
    this.lambda = lambda;
    this.enrichmentArn = lambda.functionArn;
    this.enrichmentParameters = {};
  }
  grantInvoke(pipeRole: cdk.aws_iam.IRole): void {
    this.lambda.grantInvoke(pipeRole);
  }
}

class TestLogDestination implements ILogDestination {
  parameters: LogDestinationParameters;
  constructor(private readonly logGroup: cdk.aws_logs.LogGroup) {
    this.logGroup = logGroup;
    this.parameters = {
      cloudwatchLogsLogDestination: {
        logGroupArn: logGroup.logGroupArn,
      },
    };
  }
  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.logGroup.grantWrite(pipeRole);
  }
}

new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: new TestSource(sourceQueue),
  target: new TestTarget(targetQueue),
  enrichment: new TestEnrichment(enrichmentLambda),
  logLevel: LogLevel.TRACE,
  logIncludeExecutionData: [IncludeExecutionData.ALL],

  logDestinations: [
    new TestLogDestination(loggroup),
  ],
});

const test = new IntegTest(app, 'integtest-pipe-sqs-to-sqs', {
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
      Body: uniqueIdentifier+ '-enriched',
    },
  ],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
});

app.synth();
