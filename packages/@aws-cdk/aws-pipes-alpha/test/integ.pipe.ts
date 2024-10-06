import { randomUUID } from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsTarget } from '@aws-cdk/aws-pipes-targets-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { DynamicInput, EnrichmentParametersConfig, IEnrichment, ILogDestination, IPipe, IncludeExecutionData, InputTransformation, LogDestinationConfig, LogDestinationParameters, LogLevel, Pipe } from '../lib';

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

const loggroup = new cdk.aws_logs.LogGroup(stack, 'LogGroup');

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
  bind(_pipe: IPipe): LogDestinationConfig {
    return {
      parameters: this.parameters,
    };
  }
  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.logGroup.grantWrite(pipeRole);
  }
}

const pipe = new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: new SqsSource(sourceQueue),
  target: new SqsTarget(targetQueue, {
    inputTransformation: InputTransformation.fromEventPath('$.body'),
  }),
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

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
})).expect(ExpectedResult.objectLike({
  Messages: [{ Body: uniqueIdentifier+ '-' + pipe.pipeName + '-static' }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(15),
});

app.synth();
