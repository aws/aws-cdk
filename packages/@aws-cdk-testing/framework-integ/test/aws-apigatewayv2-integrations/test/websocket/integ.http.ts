import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { ContentHandling, HttpApi, WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration, WebSocketHttpProxyIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
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

const websocketHttpIntegration = new WebSocketHttpProxyIntegration('WebsocketHttpIntegration', {
  integrationMethod: 'GET',
  integrationUri: httpApi.url,
  timeout: Duration.seconds(10),
  contentHandling: ContentHandling.CONVERT_TO_TEXT,
});

const webSocketApi = new WebSocketApi(stack, 'WebSocketApi', {
  defaultRouteOptions: {
    integration: websocketHttpIntegration,
  },
});

const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();