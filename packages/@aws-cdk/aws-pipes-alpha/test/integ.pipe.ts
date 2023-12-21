import { randomUUID } from 'crypto';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { IncludeExecutionData, LogLevel, Pipe } from '../lib';

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

new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: {
    grantRead: (role) => sourceQueue.grantConsumeMessages(role),
    sourceArn: sourceQueue.queueArn,
    sourceParameters: {},
  },
  target: {
    grantPush: (role) => targetQueue.grantSendMessages(role),
    targetArn: targetQueue.queueArn,
    targetParameters: {
      inputTemplate: '<$.body>',
    },
  },
  enrichment: {
    enrichmentArn: enrichmentLambda.functionArn,
    enrichmentParameters: {},
    grantInvoke: (role) => {
      enrichmentLambda.grantInvoke(role);
    },
  },
  logLevel: LogLevel.TRACE,
  logIncludeExecutionData: [IncludeExecutionData.ALL],

  logDestinations: [
    {
      parameters: {
        cloudwatchLogsLogDestination: {
          logGroupArn: loggroup.logGroupArn,
        },
      },
      grantPush: (role) => loggroup.grantWrite(role),
    },
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
// TODO add test for pipeName, pipeArn, pipeRole
app.synth();
