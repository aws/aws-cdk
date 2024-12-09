import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ApiGatewayTarget } from '../lib/api-gateway';

/*
 * This integration test sends a message to an SQS queue which invokes
 * the REST API. There is a Lambda function on the backend of the REST API.
 * We check that the Lambda function was invoked, proving that the message
 * made it through the pipe.
 *
 * SQS (pipe source) --> API Gateway REST API (pipe target) --> Lambda function
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-api-gw');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

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

const fn = new lambda.Function(stack, 'ConnectHandler', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { console.log(event); return { statusCode: 200, body: "connected" }; };'),
});

const restApi = new apigw.RestApi(stack, 'RestApi', {});
restApi.root.addResource('books').addResource('fiction').addMethod('GET', new apigw.LambdaIntegration(fn));

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new ApiGatewayTarget(restApi, {
    method: 'GET',
    path: '/books/*',
    headerParameters: {
      'x-header': 'myheader',
    },
    queryStringParameters: { key: '$.body' }, // use payload from SQS source
    pathParameterValues: ['fiction'],
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-api-gw', {
  testCases: [stack],
});

const payload = 'USA';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: payload,
});

const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: fn.logGroup.logGroupName,
  limit: 3,
});

const message = putMessageOnQueue.next(logEvents);

// Check that the Lambda was invoked successfully from API GW.
// Checking for the actual payload from SQS results in the following:
// "Response object is too long." The assertion below checks that
// API GW invoked the function.
message.assertAtPath('events.1.message', ExpectedResult.stringLikeRegexp('START RequestId')).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
