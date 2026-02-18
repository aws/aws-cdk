#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websocket-stage');

const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const webSocketApi = new apigwv2.WebSocketApi(stack, 'WebSocketApi');
new apigwv2.WebSocketStage(stack, 'WebSocketStage', {
  webSocketApi,
  stageName: 'dev',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
  description: 'My Stage',
  accessLogSettings: {
    destination: new apigwv2.LogGroupLogDestination(logGroup),
    format: apigw.AccessLogFormat.custom(JSON.stringify({
      extendedRequestId: apigw.AccessLogField.contextExtendedRequestId(),
      requestTime: apigw.AccessLogField.contextRequestTime(),
    })),
  },
});

new IntegTest(app, 'aws-cdk-aws-apigatewayv2-websocket-stage-test', {
  testCases: [stack],
});
