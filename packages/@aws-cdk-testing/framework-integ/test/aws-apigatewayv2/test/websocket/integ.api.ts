#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2');

new apigw.WebSocketApi(stack, 'WebSocketApi');

new IntegTest(app, 'web-socket-api', {
  testCases: [stack],
});

