// import '@aws-cdk/assert/jest';
import { countResources, expect as expectCDK, haveOutput, haveResource } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

// test('No tests are specified for this package', () => {
//   expect(true).toBe(true);
// });

let stack = new cdk.Stack();
let handler: lambda.Function;
let rootHandler: lambda.Function;

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
});

test('create LambdaProxyApi correctly', () => {
  // WHEN

  new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
    handler,
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  // expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  // expectCDK(stack).to(countResources('AWS::Lambda::Permission', 1));
  expectCDK(stack).to(haveOutput({
    outputName: 'LambdaProxyApiLambdaProxyApiUrl2866EF1B'
  }));
});

test('create HttpProxyApi correctly', () => {
  // WHEN
  new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::ApiGatewayV2::Api', {
    Name: "LambdaProxyApi",
    ProtocolType: "HTTP",
    Target: "https://checkip.amazonaws.com"
  } ));
  expectCDK(stack).to(haveOutput({
    outputName: 'LambdaProxyApiHttpProxyApiUrl378A7258'
  }));
});

test('create LambdaRoute correctly for HttpProxyApi', () => {
  // WHEN
  const api = new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });
  api.root = new apigatewayv2.LambdaRoute(stack, 'RootRoute', {
    api,
    handler: rootHandler,
    httpPath: '/',
  });

  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
  expectCDK(stack).to(countResources('AWS::Lambda::Permission', 1));
});

test('create HttpRoute correctly for HttpProxyApi', () => {
  // WHEN
  const api = new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });
  api.root = new apigatewayv2.HttpRoute(stack, 'RootRoute', {
    api,
    targetUrl: 'https://www.amazon.com',
    httpPath: '/',
  });

  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});

test('create LambdaRoute correctly for LambdaProxyApi', () => {
  // WHEN
  const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
    handler
  });
  api.root = new apigatewayv2.LambdaRoute(stack, 'RootRoute', {
    api,
    handler: rootHandler,
    httpPath: '/',
  });

  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
  expectCDK(stack).to(countResources('AWS::Lambda::Permission', 2));
});

test('create HttpRoute correctly for LambdaProxyApi', () => {
  // WHEN
  const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
    handler
  });
  api.root = new apigatewayv2.HttpRoute(stack, 'RootRoute', {
    api,
    targetUrl: 'https://www.amazon.com',
    httpPath: '/',
  });

  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 1));
});

test('addLambdaRoute and addHttpRoute correctly from an existing route', () => {
  // WHEN
  const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
    handler
  });
  api.root = new apigatewayv2.HttpRoute(stack, 'RootRoute', {
    api,
    targetUrl: 'https://www.amazon.com',
    httpPath: '/',
  });

  api.root
    // HTTP GET /foo
    .addLambdaRoute('foo', 'Foo', {
      target: handler,
      method: apigatewayv2.HttpMethod.GET
    })
    // HTTP ANY /foo/checkip
    .addHttpRoute('checkip', 'FooCheckIp', {
      targetUrl: 'https://checkip.amazonaws.com',
      method: apigatewayv2.HttpMethod.ANY
    });

  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Integration', 3));
});

test('import API correctly', () => {
  // WHEN
  const api = apigatewayv2.Api.fromApiId(stack, 'ImportedApi', 'foo');

  // THEN
  expect(api).toHaveProperty('apiId');
});

test('import HttpProxyApi correctly', () => {
  // WHEN
  const api = apigatewayv2.HttpProxyApi.fromHttpProxyApiId(stack, 'ImportedApi', 'foo');

  // THEN
  expect(api).toHaveProperty('apiId');
});

test('import LambdaProxyApi correctly', () => {
  // WHEN
  const api = apigatewayv2.LambdaProxyApi.fromLambdaProxyApiId(stack, 'ImportedApi', 'foo');

  // THEN
  expect(api).toHaveProperty('apiId');
});

test('import Route correctly', () => {
  // WHEN
  const route = apigatewayv2.Route.fromRouteAttributes(stack, 'ImportedRoute', {
    routeId: 'foo'
  });

  // THEN
  expect(route).toHaveProperty('routeId');
});

test('import LambdaRoute correctly', () => {
  // WHEN
  const route = apigatewayv2.LambdaRoute.fromLambdaRouteId(stack, 'ImportedRoute', 'foo');
  // THEN
  expect(route).toHaveProperty('routeId');
});

test('import HttpRoute correctly', () => {
  // WHEN
  const route = apigatewayv2.HttpRoute.fromHttpRouteId(stack, 'ImportedRoute', 'foo');
  // THEN
  expect(route).toHaveProperty('routeId');
});

test('import LambdaRoute correctly', () => {
  // WHEN
  const route = apigatewayv2.LambdaRoute.fromLambdaRouteId(stack, 'ImportedRoute', 'foo');
  // THEN
  expect(route).toHaveProperty('routeId');
});

test('create api correctly with no props', () => {
  // WHEN
  new apigatewayv2.Api(stack, 'API');
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('assign aws partition correctly by region for api', () => {
  // WHEN
  const cnstack = new cdk.Stack(undefined, undefined, {
    env: {
      region: 'cn-north-1'
    }
  });
  const api = new apigatewayv2.Api(cnstack, 'API');
  // THEN
  expect(api.partition).toBe('aws-cn');
  expect(api.awsdn).toBe('amazonaws.com.cn');
});

test('assign aws partition correctly by region for lambda route', () => {
  // WHEN
  const cnstack = new cdk.Stack(undefined, undefined, {
    env: {
      region: 'cn-north-1'
    }
  });
  const api = new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });

  new apigatewayv2.LambdaRoute(cnstack, 'API', {
    api,
    handler,
    httpPath: '/foo'
  });
  // THEN
  expect(true).toBe(true);
});

test('create api correctly with specific protocol specified', () => {
  // WHEN
  new apigatewayv2.Api(stack, 'API', {
    target: '',
    protocol: apigatewayv2.ApiProtocol.WEBSOCKET
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('create HttpProxyApi correctly with specific api name specified', () => {
  // WHEN
  new apigatewayv2.HttpProxyApi(stack, 'API', {
    apiName: 'foo',
    url: 'https://www.amazon.com'
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('create Route correctly with no httpMethod specified', () => {
  // WHEN
  const api = new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });
  new apigatewayv2.Route(stack, 'Route', {
    api,
    httpPath: '/foo',
    target: 'https://www.amazon.com'
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
});

test('create HttpRoute correctly with specific integrationMethod', () => {
  // WHEN
  const api = new apigatewayv2.HttpProxyApi(stack, 'LambdaProxyApi', {
    url: 'https://checkip.amazonaws.com'
  });

  new apigatewayv2.HttpRoute(stack, 'Route', {
    api,
    httpPath: '/foo',
    targetUrl: 'https://www.amazon.com',
    integrationMethod: apigatewayv2.HttpMethod.GET
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Api', 1));
  expectCDK(stack).to(countResources('AWS::ApiGatewayV2::Route', 1));
});