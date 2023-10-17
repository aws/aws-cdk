#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as apigw from '../../lib';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-http-stage');

const authLambda = new Function(stack, 'AuthLambda', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: Code.fromInline('// dummy func'),
});

const lambdaAuthorizer = new HttpLambdaAuthorizer('Authorizer', authLambda, {
  responseTypes: [HttpLambdaResponseType.SIMPLE],
});

const httpApi = new apigw.HttpApi(stack, 'HttpApi', {
  apiName: 'my-api',
  createDefaultStage: true,
  defaultAuthorizer: lambdaAuthorizer,
});

const integration = new HttpLambdaIntegration('Integration', new Function(stack, 'DummyLambda', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: Code.fromInline('// dummy func'),
}));

new apigw.HttpRoute(stack, 'Route', {
  httpApi: httpApi,
  routeKey: apigw.HttpRouteKey.with('/v1/mything/{proxy+}', apigw.HttpMethod.ANY),
  integration: integration,
});

new IntegTest(app, 'cdk-integ-route', {
  testCases: [stack],
});
