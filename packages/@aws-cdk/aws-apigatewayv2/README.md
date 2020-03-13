## AWS::APIGatewayv2 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

`aws-apigatewayv2` supports the `HTTP` API for Amazon API Gateway.

## Examples:

### HTTP API with Lambda proxy integration as the `$default` route

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';

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

// Create a HTTP API with Lambda Proxy Integration as $default route
const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
  handler
});
```
### HTTP API with HTTP proxy integration as the `$default` route

```ts
new apigatewayv2.HttpProxyApi(stack, 'HttpProxyApi', {
  url: 'https://aws.amazon.com'
});
```

## Root Route

Create the `root(/)` route of the API

```ts

// prepare the root handler function
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


// create a HTTP API with Lambda Proxy Integration as $default route
const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
  handler
});

// create the root route(/) with HTTP ANY method and Lambda integration
api.root = new apigatewayv2.LambdaRoute(stack, 'RootRoute', {
  api,
  handler: rootHandler,
  httpPath: '/',
});

// create child routes from the root
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
```

## Create any route with no `root`

If we just need a specific route like `/some/very/deep/route/path` without the `root(/)` and make all requests to other paths go to the `$default`, we can simply create it like this:

```ts
// create a HTTP API with HTTP Proxy Integration as the $default
new apigatewayv2.HttpProxyApi(stack, 'HttpProxyApi', {
  url: 'https://aws.amazon.com'
});


// create a specific route
const someDeepLambdaRoute = new apigatewayv2.LambdaRoute(stack, 'SomeLambdaRoute', {
  api,
  handler,
  httpPath: '/some/very/deep/route/path',
});

// print the full http url for this route
new cdk.CfnOutput(stack, 'RouteURL', {
  value: someDeepLambdaRoute.fullUrl
});

// and build even more child routes from here
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
```