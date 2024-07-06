import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ApiGatewayTarget } from '../lib/api-gateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-api-gw');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

// SQS (pipe source) --> API Gateway REST API (pipe target) --> Lambda function

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

const fn = new lambda.Function(stack, 'ConnectHandler', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { console.log(event); return { statusCode: 200, body: "connected" }; };'),
});

const restApi = new apigw.RestApi(stack, 'RestApi', {});
restApi.root.addMethod('GET', new apigw.LambdaIntegration(fn));

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new ApiGatewayTarget(restApi, {
    method: 'GET',
    headerParameters: {
      'x-header': 'myheader',
    },
    queryStringParameters: { key: 'USA' },
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-api-gw', {
  testCases: [stack],
});

const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: 'USA',
});

const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: fn.logGroup.logGroupName,
  limit: 1,
});

const message = putMessageOnQueue.next(logEvents);

// Check that the Lambda was invoked successfully from API GW
message.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp('INIT_START')).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
