#!/usr/bin/env node
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

new integ.IntegTest(app, 'WebSocketStageWithLogsTest', {
  testCases: [stack],
});

app.synth();