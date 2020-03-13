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


## Introduction

Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud. As an API Gateway API developer, you can create APIs for use in your own client applications. Or you can make your APIs available to third-party app developers. For more infomation, read the [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html).


## API

This construct library at this moment implements API resources from [AWS::ApiGatewayV2::Api](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html), which supports both `WebSocket APIs` and `HTTP APIs`.

For more information about WebSocket APIs, see [About WebSocket APIs in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html) in the _API Gateway Developer Guide_. For more information about HTTP APIs, see [HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) in the _API Gateway Developer Guide_.


### HTTP API

`CfnApi` is the L1 construct to create either `WebSocket APIs` or `HTTP APIs`. At this moment, `HTTP APIs` supports both `Lambda Proxy Integration` and `HTTP Proxy Integration`. See [Working with AWS Lambda Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) and [Working with HTTP Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html) for more information.


To create `HTTP APIs` with `Lambda Proxy Integration`, simply use  `LambdaProxyApi`.


```ts
// Create a HTTP API with Lambda Proxy Integration as its $default route
const api = new apigatewayv2.LambdaProxyApi(stack, 'LambdaProxyApi', {
  handler
});
```

To create `HTTP APIs` with Lambda proxy integration, use `HttpProxyApi` instead.

```ts
// Create a HTTP API with HTTP Proxy Integration
new apigatewayv2.HttpProxyApi(stack, 'HttpProxyApi', {
  url: 'https://aws.amazon.com'
});
```


### WebSocket API

The WebSocket APIs are not supported yet in this L2 construct library, however, as `Api` class is provided, it's still possible to create the Websocket APIs with the `Api` class.


## Route

Routes direct incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource path. For example, `GET /pets`. You can define specific HTTP methods for your route, or use the ANY method to match all methods that you haven't defined for a resource. You can create a `$default route` that acts as a catch-all for requests that don’t match any other routes. See [Working with Routes for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html).

When you create HTTP APIs with either `Lambda Proxy Integration` or `HTTP Proxy Integration`, the `$default route` will be created as well.

To create a specific route for an existing `Api` resource, specify the `httpPath` and an optional `httpMethod` property.

```ts
// create a specific 'GET /some/very/deep/route/path' route with Lambda proxy integration for an existing HTTP API
const someDeepLambdaRoute = new apigatewayv2.LambdaRoute(stack, 'SomeLambdaRoute', {
  api,
  handler,
  httpPath: '/some/very/deep/route/path',
  // optional
  httpMethod: HttpMethod.GET 
});
```

### `addLambdaRoute` and `addHttpRoute`

To extend the routes from an existing HTTP API, use `addLambdaRoute` for Lambda proxy integration or `addHttpRoute` for HTTP Proxy Intgegration.

Consider the providewd example above

```ts
// create a specific 'GET /some/very/deep/route/path' route with Lambda proxy integration for an existing HTTP API
const someDeepLambdaRoute = new apigatewayv2.LambdaRoute(stack, 'SomeLambdaRoute', {
  api,
  handler,
  httpPath: '/some/very/deep/route/path',
  httpMethod: HttpMethod.GET
});

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

// print the full URL in the Outputs
new cdk.CfnOutput(stack, 'SomeDeepLambdaRouteURL', {
  value: someDeepLambdaRoute.fullUrl
});
```

