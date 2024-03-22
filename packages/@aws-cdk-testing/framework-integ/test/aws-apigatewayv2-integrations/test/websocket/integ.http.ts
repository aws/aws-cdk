import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { ContentHandling, HttpApi, WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration, WebSocketHttpIntegration, WebSocketHttpProxyIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as logs from 'aws-cdk-lib/aws-logs';
import * as assert from 'node:assert';

/*
 * Stack verification steps:
 * 1. Connect: 'wscat -c <endpoint-in-the-stack-output>'. Should connect successfully and print event data containing connectionId in cloudwatch
 * 2. Default: '> {"data": "some-data"}'. Should send the message successfully and print the data in cloudwatch
 */

const app = new App();
const stack = new Stack(app, 'WebSocketHttpApiInteg');

// We first create an HTTP endpoint and API to have something to proxy
const httpHandler = new lambda.Function(stack, 'HttpHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { console.log(event); return { statusCode: 200, body: "success" }; };'),
});

const httpApi = new HttpApi(stack, 'HttpApi', {
  defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', httpHandler),
});
assert(httpApi.url, 'HTTP API URL is required');

const webSocketApi = new WebSocketApi(stack, 'WebSocketApi', {});

const websocketHttpIntegration = new WebSocketHttpIntegration('WebsocketHttpIntegration', {
  integrationMethod: 'GET',
  integrationUri: httpApi.url,
  timeout: Duration.seconds(10),
  // contentHandling: ContentHandling.CONVERT_TO_BINARY,
});
webSocketApi.addRoute('http', {
  integration: websocketHttpIntegration,
  returnResponse: true,
});

const websocketHttpProxyIntegration = new WebSocketHttpProxyIntegration('WebsocketHttpIntegration', {
  integrationMethod: 'GET',
  integrationUri: httpApi.url,
  timeout: Duration.seconds(10),
  contentHandling: ContentHandling.CONVERT_TO_TEXT,
});
webSocketApi.addRoute('http-proxy', {
  integration: websocketHttpProxyIntegration,
  returnResponse: true,
});

const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

// FIXME https://github.com/aws/aws-cdk/issues/11100
/* const accessLogs = new logs.LogGroup(stack, 'APIGW-AccessLogs');
(stage.node.defaultChild as CfnStage).accessLogSettings = {
  destinationArn: accessLogs.logGroupArn,
  format: JSON.stringify({
    requestId: '$context.requestId',
    userAgent: '$context.identity.userAgent',
    sourceIp: '$context.identity.sourceIp',
    requestTime: '$context.requestTime',
    requestTimeEpoch: '$context.requestTimeEpoch',
    httpMethod: '$context.httpMethod',
    path: '$context.path',
    status: '$context.status',
    protocol: '$context.protocol',
    responseLength: '$context.responseLength',
    domainName: '$context.domainName',
  }),
};

const role = new iam.Role(stack, 'ApiGWLogWriterRole', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
});

const policy = new iam.PolicyStatement({
  actions: [
    'logs:CreateLogGroup',
    'logs:CreateLogStream',
    'logs:DescribeLogGroups',
    'logs:DescribeLogStreams',
    'logs:PutLogEvents',
    'logs:GetLogEvents',
    'logs:FilterLogEvents',
  ],
  resources: ['*'],
});

role.addToPolicy(policy);
accessLogs.grantWrite(role); */

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();