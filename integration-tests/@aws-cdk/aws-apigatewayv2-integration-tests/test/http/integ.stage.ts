#!/usr/bin/env node
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-http-stage');

const httpApi = new apigw.HttpApi(stack, 'HttpApi', { createDefaultStage: false });
new apigw.HttpStage(stack, 'HttpStageWithProperties', {
  httpApi,
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
});

app.synth();
