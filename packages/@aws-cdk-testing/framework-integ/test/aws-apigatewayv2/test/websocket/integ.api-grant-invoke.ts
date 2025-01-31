#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2');

const websocketApi = new apigw.WebSocketApi(stack, 'webocket-api');

new apigw.WebSocketStage(stack, 'websocket-stage', {
  stageName: 'prod',
  webSocketApi: websocketApi,
});

new iam.Role(stack, 'test-iam-role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  inlinePolicies: {
    webSocketAccess: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['execute-api:Invoke'],
          resources: [
            websocketApi.arnForExecuteApiV2(),
            websocketApi.arnForExecuteApiV2('connect', 'prod'),
          ],
        }),
      ],
    }),
  },
});

new IntegTest(app, 'web-socket-api', {
  testCases: [stack],
});
