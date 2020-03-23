import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';
import { HttpMethod, Integration } from '../lib';

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

const checkIpUrl = 'https://checkip.amazonaws.com';
const awsUrl = 'https://aws.amazon.com';

// create a basic HTTP API with http proxy integration as the $default route
const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  targetUrl: checkIpUrl,
});

// create a lambda proxy integration for the api
const rootIntegration = new apigatewayv2.LambdaProxyIntegration(stack, 'RootIntegration', {
  api,
  targetHandler: rootHandler
});

// pass the rootIntegration to addRootRoute() to initialize the root route
// HTTP GET /
api.addRootRoute(rootIntegration, HttpMethod.GET)
  // HTTP GET /foo
  .addLambdaRoute('foo', 'Foo', {
    target: handler,
    method: apigatewayv2.HttpMethod.GET
  })
  // HTTP ANY /foo/aws
  .addHttpRoute('aws',  'AwsPage', {
    targetUrl: awsUrl,
    method: apigatewayv2.HttpMethod.ANY
  })
  // HTTP ANY /foo/aws/checkip
  .addHttpRoute('checkip', 'CheckIp', {
    targetUrl: checkIpUrl,
    method: apigatewayv2.HttpMethod.ANY
  });

// // addLambdaRoute from this API
// // HTTP ANY /fn
// httpApi.addLambdaRoute('/fn', 'LambdaRoute', {
//   target: handler
// });

// const httpApi2 = new apigatewayv2.HttpApi(stack, 'HttpApi2', {
//   targetHandler: handler
// });

// const integRootHandler = new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
//   api: httpApi2,
//   targetHandler: rootHandler
// });

// // create a root route for the API
// httpApi2.root = new apigatewayv2.Route(stack, 'RootRoute', {
//   api: httpApi2,
//   httpPath: '/',
//   integration: integRootHandler
// });

// httpApi2.root
//   // HTTP GET /foo
//   .addLambdaRoute('foo', 'Foo', {
//     target: handler,
//     method: apigatewayv2.HttpMethod.GET
//   })
//   // HTTP ANY /foo/aws
//   .addHttpRoute('aws',  'AwsPage', {
//     targetUrl: awsUrl,
//     method: apigatewayv2.HttpMethod.ANY
//   })
//   // HTTP ANY /foo/aws/checkip
//   .addHttpRoute('checkip', 'CheckIp', {
//     targetUrl: checkIpUrl,
//     method: apigatewayv2.HttpMethod.ANY
//   });
