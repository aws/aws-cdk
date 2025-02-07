#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2');

new apigw.HttpApi(stack, 'HttpApi', {
  routeSelectionExpression: true,
});

new IntegTest(app, 'http-api', {
  testCases: [stack],
});

