import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { HttpApi, LambdaProxyIntegration } from '../lib';

const app = new App();

const stack = new Stack(app, 'ApiagtewayV2HttpApi');

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

// const rootUrl = 'https://checkip.amazonaws.com';
// const defaultUrl = 'https://aws.amazon.com';

// create a basic HTTP API with http proxy integration as the $default route
new HttpApi(stack, 'HttpApi', {
  defaultIntegration: new LambdaProxyIntegration({
    handler,
  }),
});

// new Route(api, 'allroutes', {
//   httpApi: api,
//   path: '/',
//   method: HttpMethod.ANY,
//   integration: new LambdaProxyIntegration({
//     handler,
//   }),
// });

// new Stage(api, 'mystage', {
//   api,
// });

// api.addRoutes('/books/reviews', 'GetBookReviewRoute', {
//   methods: [HttpMethod.GET],
//   integration: new LambdaProxyIntegration(stack, 'getBookReviewInteg', {
//     api,
//     targetHandler: getbookReviewsHandler,
//   }),
// });

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