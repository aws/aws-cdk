import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ApiagtewayV2HttpApi');

const handler = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.PYTHON_3_7,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
import json
def handler(event, context):
      return {
        'statusCode': 200,
        'body': json.dumps(event)
      }`),
});

const rootHandler = new lambda.Function(stack, 'RootFunc', {
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

// Create a HTTP API with Lambda Proxy Integration as $default route
const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
  handler
});

// Create the root route(/) with HTTP ANY method and Lambda integration
api.root = new apigatewayv2.LambdaRoute(stack, 'RootRoute', {
  api,
  handler: rootHandler,
  httpPath: '/',
});

api.root
  // HTTP GET /foo
  .addLambdaRoute('foo', 'Foo', {
    target: handler,
    method: apigatewayv2.HttpMethod.GET
  })
  // HTTP ANY /foo/checkip
  .addHttpRoute('checkip',  'FooCheckIp', {
    targetUrl: 'https://checkip.amazonaws.com',
    method: apigatewayv2.HttpMethod.ANY
  });

// api.root
//   // HTTP GET /bar
//   .addLambdaRoute('bar', 'Bar', {
//     target: handler2,
//     method: apigatewayv2.HttpMethod.ANY
//   });

// Create a HTTP API with HTTP Proxy Integration
new apigatewayv2.HttpProxyApi(stack, 'HttpProxyApi', {
  url: 'https://aws.amazon.com'
});

const someDeepLambdaRoute = new apigatewayv2.LambdaRoute(stack, 'SomeLambdaRoute', {
  api,
  handler,
  httpPath: '/some/very/deep/route/path',
});

// new cdk.CfnOutput(stack, 'RouteURL', {
//   value: someDeepLambdaRoute.fullUrl
// });

someDeepLambdaRoute
  // HTTP ANY /some/very/deep/route/path/bar
  .addLambdaRoute('bar', 'SomeDeepPathBar', {
    target: handler,
    method: apigatewayv2.HttpMethod.GET
  })
  // HTTP ANY /some/very/deep/route/path/bar/checkip
  .addHttpRoute('checkip', 'SomeDeepPathBarCheckIp', {
    targetUrl: 'https://checkip.amazonaws.com',
    method: apigatewayv2.HttpMethod.ANY
  });

new cdk.CfnOutput(stack, 'SomeDeepLambdaRouteURL', {
  value: someDeepLambdaRoute.fullUrl
});
