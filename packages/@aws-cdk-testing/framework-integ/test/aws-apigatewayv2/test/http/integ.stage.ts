#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-http-stage');

const testLogGroup = new logs.LogGroup(stack, 'MyLogGroup');

const httpApi = new apigwv2.HttpApi(stack, 'HttpApi', { createDefaultStage: false });
new apigwv2.HttpStage(stack, 'HttpStageWithProperties', {
  httpApi,
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
  description: 'My Stage',
  accessLogSettings: {
    destination: new apigwv2.LogGroupLogDestination(testLogGroup),
    format: apigw.AccessLogFormat.custom(JSON.stringify({
      extendedRequestId: apigw.AccessLogField.contextExtendedRequestId(),
      requestTime: apigw.AccessLogField.contextRequestTime(),
    })),
  },
});

new IntegTest(app, 'aws-cdk-aws-apigatewayv2-http-stage-test', {
  testCases: [stack],
});
