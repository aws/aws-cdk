#!/usr/bin/env node
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as apigw from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-http-stage-test');

const httpApiWithTwoStages = new apigw.HttpApi(stack, 'HttpApiWithTwoStages', { createDefaultStage: false });
new apigw.HttpStage(stack, 'HttpDevStageWithProperties', {
  httpApi: httpApiWithTwoStages,
  stageName: 'dev',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  accessLogEnabled: true,
  detailedMetricsEnabled: true,
});

new apigw.HttpStage(stack, 'HttpProdStageWithProperties', {
  httpApi: httpApiWithTwoStages,
  stageName: 'prod',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  accessLogEnabled: true,
  detailedMetricsEnabled: true,
});

const httpApiWithExternalLogGroup = new apigw.HttpApi(stack, 'HttpApiWithExternalLogGroup', { createDefaultStage: false });
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

new apigw.HttpStage(stack, 'HttpDevStageWithExternalLogGroup', {
  httpApi: httpApiWithExternalLogGroup,
  stageName: 'dev',
  accessLogEnabled: true,
  accessLogGroupArn: logGroup.logGroupArn,
  accessLogFormat: accessLogFormat,
});

new integ.IntegTest(app, 'HttpSocketStageWithLogsTest', {
  testCases: [stack],
});

app.synth();