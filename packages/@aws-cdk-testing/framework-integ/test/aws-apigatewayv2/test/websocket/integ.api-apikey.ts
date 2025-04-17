#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websockets');

new apigw.WebSocketApi(stack, 'MyWebsocketApi', {
  apiKeySelectionExpression: apigw.WebSocketApiKeySelectionExpression.HEADER_X_API_KEY,
});

app.synth();
