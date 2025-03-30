#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-http-stage');

const testLogGroup = new logs.LogGroup(stack, 'MyLogGroup');

const httpApi = new apigw.HttpApi(stack, 'HttpApi', { createDefaultStage: false });
new apigw.HttpStage(stack, 'HttpStageWithProperties', {
  httpApi,
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
  description: 'My Stage',
  accessLogDestination: new apigw.LogGroupLogDestination(testLogGroup),
});

new IntegTest(app, 'aws-cdk-aws-apigatewayv2-http-stage-test', {
  testCases: [stack],
});
