import { Pipe } from '@aws-cdk/aws-pipes-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ApiDestinationTarget } from '../lib/api-destination';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-api-dest');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

/*
 * This integration test creates an API Gateway HTTP API in order to
 * validate that the pipe executes properly. The flow is as follows:
 *
 * SQS (pipe source) --> EventBridge API destination (pipe target)
 * --> API Gateway HTTP API --> Lambda function
 */

const fn = new lambda.Function(stack, 'ConnectHandler', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { console.log(event); return { statusCode: 200, body: "connected" }; };'),
});

const integration = new HttpLambdaIntegration('LambdaIntegration', fn);
const httpApi = new apigwv2.HttpApi(stack, 'HttpApi');
httpApi.addRoutes({
  path: '/books',
  methods: [apigwv2.HttpMethod.GET],
  integration,
});

const secret = new cdk.aws_secretsmanager.Secret(stack, 'MySecret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('abc123'),
});

const connection = new cdk.aws_events.Connection(stack, 'MyConnection', {
  authorization: cdk.aws_events.Authorization.apiKey('x-api-key', secret.secretValue),
  description: 'Connection with API Key x-api-key',
  connectionName: 'MyConnection',
});

const destination = new cdk.aws_events.ApiDestination(stack, 'MyDestination', {
  connection,
  endpoint: `${httpApi.apiEndpoint}/books`,
  httpMethod: cdk.aws_events.HttpMethod.GET,
  apiDestinationName: 'ApiGwHttpApi',
  rateLimitPerSecond: 1,
  description: 'Calling API GW HTTP API',
});

new Pipe(stack, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: new ApiDestinationTarget(destination, {
    headerParameters: {
      'x-header': 'myheader',
      'x-api-key': 'apiKeyFromHeaderParams', // check which header has precedence
    },
    queryStringParameters: { key: '$.body' },
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-api-dest', {
  testCases: [stack],
});

const payload = 'UnitedStates';
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: payload,
});

const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: fn.logGroup.logGroupName,
  limit: 3,
});

const message = putMessageOnQueue.next(logEvents);

// Check that the Lambda was invoked successfully from API GW
// Payload from SQS is in the third log line
message.assertAtPath('events.2.message', ExpectedResult.stringLikeRegexp(payload)).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
