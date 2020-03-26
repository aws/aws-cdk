import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';
import { HttpMethod, HttpProxyIntegration, LambdaProxyIntegration } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ApiagtewayV2HttpApi');

const getbooksHandler = new lambda.Function(stack, 'MyFunc', {
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

const getbookReviewsHandler = new lambda.Function(stack, 'RootFunc', {
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

const rootUrl = 'https://checkip.amazonaws.com';
const defaultUrl = 'https://aws.amazon.com';

// create a basic HTTP API with http proxy integration as the $default route
const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  targetUrl: defaultUrl,
});

api.addRoutes('/', 'RootRoute', {
  methods: [HttpMethod.GET, HttpMethod.POST],
  integration: new HttpProxyIntegration(stack, 'RootInteg', {
    api,
    targetUrl: rootUrl
  })
});

api.addRoutes('/books', 'GetBooksRoute', {
  methods: [HttpMethod.GET],
  integration: new LambdaProxyIntegration(stack, 'getbooksInteg', {
    api,
    targetHandler: getbooksHandler,
  }),
});

api.addRoutes('/books/reviews', 'GetBookReviewRoute', {
  methods: [HttpMethod.GET],
  integration: new LambdaProxyIntegration(stack, 'getBookReviewInteg', {
    api,
    targetHandler: getbookReviewsHandler
  })
});

// // pass the rootIntegration to addRootRoute() to initialize the root route
// // HTTP GET /
// api.addRootRoute(rootIntegration, HttpMethod.GET)
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