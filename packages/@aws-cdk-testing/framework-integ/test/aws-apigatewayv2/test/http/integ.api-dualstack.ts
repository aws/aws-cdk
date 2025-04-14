#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'DualStackHttpApiStack');

new apigw.HttpApi(stack, 'HttpApi', {
  routeSelectionExpression: true,
  ipAddressType: apigw.IpAddressType.DUAL_STACK,
});

new IntegTest(app, 'DualStackHttpApiInteg', {
  testCases: [stack],
});

