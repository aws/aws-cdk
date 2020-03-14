// import '@aws-cdk/assert/jest';
import { countResources, expect as expectCDK } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

let stack = new cdk.Stack();
let handler: lambda.Function;
let rootHandler: lambda.Function;
let checkIpUrl: string;
let awsUrl: string;

beforeEach(() => {
  stack = new cdk.Stack();
  handler = new lambda.Function(stack, 'MyFunc', {
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'index.handler',
    code: new lambda.InlineCode(`
import json
def handler(event, context):
      return {
        'statusCode': 200,
        'body': json.dumps(event)
      }`),
    reservedConcurrentExecutions: 10,
  });

  rootHandler = new lambda.Function(stack, 'RootFunc', {
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'index.handler',
    code: new lambda.InlineCode(`
import json, os
def handler(event, context):
      whoami = os.environ['WHOAMI']
      http_path = os.environ['HTTP_PATH']
      return {
        'statusCode': 200,
        'body': json.dumps({ 'whoami': whoami, 'http_path': http_path })
      }`),
    environment: {
      WHOAMI: 'root',
      HTTP_PATH: '/'
    },
  });
  checkIpUrl = 'https://checkip.amazonaws.com';
  awsUrl = 'https://aws.amazon.com';
});

test('create a HTTP API with no props correctly', () => {
  // WHEN
  new apigatewayv2.HttpApi(stack, 'HttpApi');
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('create a basic HTTP API correctly', () => {
  // WHEN
  new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetUrl: checkIpUrl,
    protocol: apigatewayv2.ProtocolType.HTTP
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('create a basic HTTP API correctly with target handler', () => {
  // WHEN
  new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('import HTTP API from API ID correctly', () => {
  // WHEN
  // THEN
  expect(() =>
    apigatewayv2.HttpApi.fromApiId(stack, 'HttpApi', 'foo')
  ).not.toThrowError();
});

test('create lambda proxy integration correctly', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
    api: httpApi,
    targetHandler: rootHandler
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});

test('create HTTP proxy integration correctly with targetUrl', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  new apigatewayv2.HttpProxyIntegration(stack, 'IntegRootHandler', {
    api: httpApi,
    targetUrl: 'https://aws.amazon.com',
    integrationMethod: apigatewayv2.HttpMethod.GET
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});

test('create HTTP proxy integration correctly with Integration', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  new apigatewayv2.Integration(stack, 'IntegRootHandler', {
    apiId: httpApi.httpApiId,
    integrationMethod: apigatewayv2.HttpMethod.ANY,
    integrationType: apigatewayv2.IntegrationType.HTTP_PROXY,
    integrationUri: awsUrl
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});

test('import integration from integration ID correctly', () => {
  // WHEN
  // THEN
  expect(() =>
    apigatewayv2.Integration.fromIntegrationId(stack, 'Integ', 'foo')
  ).not.toThrowError();
});

test('create the root route correctly', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  const integRootHandler = new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
    api: httpApi,
    targetHandler: rootHandler
  });
  httpApi.root = new apigatewayv2.Route(stack, 'RootRoute', {
    api: httpApi,
    httpPath: '/',
    integration: integRootHandler
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Route', 1));
});

test('import route from route ID correctly', () => {
  // WHEN
  // THEN
  expect(() =>
    apigatewayv2.Route.fromRouteId(stack, 'Integ', 'foo')
  ).not.toThrowError();
});

test('addLambdaRoute correctly', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  const integRootHandler = new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
    api: httpApi,
    targetHandler: rootHandler
  });
  httpApi.root = new apigatewayv2.Route(stack, 'RootRoute', {
    api: httpApi,
    httpPath: '/',
    integration: integRootHandler
  });
  httpApi.root.addLambdaRoute('foo', 'Foo', {
    target: handler,
    method: apigatewayv2.HttpMethod.GET
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 2));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Route', 2));
});

test('addHttpRoute correctly', () => {
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  const integRootHandler = new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
    api: httpApi,
    targetHandler: rootHandler
  });
  httpApi.root = new apigatewayv2.Route(stack, 'RootRoute', {
    api: httpApi,
    httpPath: '/',
    integration: integRootHandler
  });
  httpApi.root.addHttpRoute('aws', 'AwsPage', {
    targetUrl: awsUrl,
    method: apigatewayv2.HttpMethod.ANY
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 2));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Route', 2));
});

test('throws when both targetHandler and targetUrl are specified', () => {
  // WHEN
  // THEN
  expect(() =>
  new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler,
    targetUrl: awsUrl
  })
  ).toThrowError(/You must specify either a targetHandler or targetUrl, use at most one/);
});

test('throws when both targetHandler and targetUrl are specified for Route', () => {
  // WHEN
  const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  // THEN
  expect(() =>
    new apigatewayv2.Route(stack, 'Route', {
      api,
      httpPath: '/',
      targetUrl: awsUrl,
      targetHandler: handler
    })
  ).toThrowError(/You must specify targetHandler, targetUrl or integration, use at most one/);
});

test('throws when targetHandler, targetUrl and integration all specified for Route', () => {
  // WHEN
  const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  const integ = new apigatewayv2.Integration(stack, 'IntegRootHandler', {
    apiId: api.httpApiId,
    integrationMethod: apigatewayv2.HttpMethod.ANY,
    integrationType: apigatewayv2.IntegrationType.HTTP_PROXY,
    integrationUri: awsUrl
  });
  // THEN
  expect(() =>
    new apigatewayv2.Route(stack, 'Route', {
      api,
      httpPath: '/',
      targetUrl: awsUrl,
      targetHandler: handler,
      integration: integ
    })
  ).toThrowError(/You must specify targetHandler, targetUrl or integration, use at most one/);
});

test('throws when targetHandler, targetUrl and integration all unspecified for Route', () => {
  // WHEN
  const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
    targetHandler: handler
  });
  // THEN
  expect(() =>
    new apigatewayv2.Route(stack, 'Route', {
      api,
      httpPath: '/',
    })
  ).toThrowError(/You must specify either a integration, targetHandler or targetUrl/);
});

test('create LambdaProxyIntegration correctly in aws china region', () => {
  // GIVEN
  const app = new cdk.App();
  const stackcn = new cdk.Stack(app, 'stack', { env: { region: 'cn-north-1' } });
  const handlercn = new lambda.Function(stackcn, 'MyFunc', {
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'index.handler',
    code: new lambda.InlineCode(`
import json
def handler(event, context):
      return {
        'statusCode': 200,
        'body': json.dumps(event)
      }`),
    reservedConcurrentExecutions: 10,
  });
  // WHEN
  const httpApi = new apigatewayv2.HttpApi(stackcn, 'HttpApi', {
    targetUrl: awsUrl
  });
  // THEN
  new apigatewayv2.LambdaProxyIntegration(stackcn, 'IntegRootHandler', {
    api: httpApi,
    targetHandler: handlercn
  });
  // THEN
  expectCDK(stackcn).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});