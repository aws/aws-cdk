#!/usr/bin/env node
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import { WebSocketApiKeySelectionExpression } from '@aws-cdk/aws-apigatewayv2';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websockets');

new apigw.WebSocketApi(stack, 'MyWebsocketApi', {
  apiKeySelectionExpression: WebSocketApiKeySelectionExpression.HEADER_X_API_KEY,
});

app.synth();