#!/usr/bin/env node
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websocket-stage');

const webSocketApi = new apigw.WebSocketApi(stack, 'WebSocketApi');
new apigw.WebSocketStage(stack, 'WebSocketStage', {
  webSocketApi,
  stageName: 'dev',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
});

app.synth();
