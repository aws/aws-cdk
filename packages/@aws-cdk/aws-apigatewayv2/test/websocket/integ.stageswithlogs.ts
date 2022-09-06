#!/usr/bin/env node
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as apigw from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websocket-stage-test');

const webSocketApi = new apigw.WebSocketApi(stack, 'WebSocketApi');
new apigw.WebSocketStage(stack, 'WebSocketDevStage', {
  webSocketApi,
  stageName: 'dev',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  accessLogEnabled: true,
  dataTraceLoggingLevel: 'INFO',
});

new apigw.WebSocketStage(stack, 'WebSocketProdStage', {
  webSocketApi,
  stageName: 'prod',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  accessLogEnabled: true,
  dataTraceLoggingLevel: 'INFO',
});

const websocketApiWithExternalLogGroup = new apigw.WebSocketApi(stack, 'WebSocketApiWithExternalLogGroup');
const logGroup = new logs.LogGroup(stack, 'dev-access-log-group', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  retention: 7,
});

export const accessLogFormat = JSON.stringify({
  apigw: {
    api_id: '$context.apiId',
    stage: '$context.stage',
  },
  request: {
    request_id: '$context.requestId',
    extended_request_id: '$context.extendedRequestId',
  },
});

new apigw.WebSocketStage(stack, 'WebSocketDevStageWithExternalLogGroup', {
  webSocketApi: websocketApiWithExternalLogGroup,
  stageName: 'dev',
  accessLogEnabled: true,
  accessLogGroupArn: logGroup.logGroupArn,
  accessLogFormat: accessLogFormat,
});

new integ.IntegTest(app, 'WebSocketStageWithLogsTest', {
  testCases: [stack],
});

app.synth();