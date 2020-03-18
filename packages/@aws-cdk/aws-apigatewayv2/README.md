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

Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket 
APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud. 
As an API Gateway API developer, you can create APIs for use in your own client applications. Read the 
[Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html).

This module supports features under [API Gateway v2](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ApiGatewayV2.html) 
that lets users set up Websocket and HTTP APIs.

## API

Amazon API Gateway supports `HTTP APIs`, `WebSocket APIs` and `REST APIs`. For more information about `WebSocket APIs` and `HTTP APIs`, 
see [About WebSocket APIs in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html) 
and [HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html). 

For more information about `REST APIs`, see [Working with REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html). To create [REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html) with AWS CDK, use `@aws-cdk/aws-apigateway` instead.


### HTTP API


HTTP APIs enable you to create RESTful APIs that integrate with AWS Lambda functions or to any routable HTTP endpoint.

HTTP API supports both `Lambda Proxy Integration` and `HTTP Proxy Integration`. 
See [Working with AWS Lambda Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) 
and [Working with HTTP Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html) 
for more information.



Use `HttpApi` to create HTTP APIs with Lambda or HTTP proxy integration.


```ts
// Create a vanilla HTTP API with no integration targets
const httpApi1 = new apigatewayv2.HttpApi(stack, 'HttpApi1');

// Create a HTTP API with Lambda Proxy Integration as its $default route
const httpApi2 = new apigatewayv2.HttpApi(stack, 'HttpApi2', {
  targetHandler: handler
});

// Create a HTTP API with HTTP Proxy Integration as its $default route
const httpApi3 = new apigatewayv2.HttpApi(stack, 'HttpApi3', {
  targetUrl: checkIpUrl
});
```

## Route

`Routes` direct incoming API requests to backend resources. `Routes` consist of two parts: an HTTP method and a resource path—for example, 
`GET /pets`. You can define specific HTTP methods for your route, or use the `ANY` method to match all methods that you haven't defined for a resource. 
You can create a `$default route` that acts as a catch-all for requests that don’t match any other routes. See 
[Working with Routes for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html).

When you create HTTP APIs with either `Lambda Proxy Integration` or `HTTP Proxy Integration`, the `$default route` will be created as well.



To create a root route for an existing `Api` resource

```ts
// create a root route for the API
httpApi.root = new apigatewayv2.Route(stack, 'RootRoute', {
  api: httpApi,
  httpPath: '/',
  integration: integRootHandler
});
```
And extend different routes from the root route

```ts
const checkIpUrl = 'https://checkip.amazonaws.com';
const awsUrl = 'https://aws.amazon.com';

httpApi.root
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
```

To create a specific route directly rather than building it from the root, just create the `Route` resource with `targetHandler`, `targetUrl` or `integration`.

```ts
// create a specific 'GET /some/very/deep/route/path' route with Lambda proxy integration for an existing HTTP API
const someDeepRoute = new apigatewayv2.Route(stack, 'SomeDeepRoute', {
  api: httpApi,
  httpPath: '/some/very/deep/route/path',
  targetHandler
});

// with HTTP proxy integration
const someDeepRoute = new apigatewayv2.Route(stack, 'SomeDeepRoute', {
  api: httpApi,
  httpPath: '/some/very/deep/route/path',
  targetUrl
});

// with existing integration resource
const someDeepRoute = new apigatewayv2.Route(stack, 'SomeDeepRoute', {
  api: httpApi,
  httpPath: '/some/very/deep/route/path',
  integration
});
```

You may also `addLambdaRoute` or `addHttpRoute` from the `HttpAppi` resource.

```ts
// addLambdaRoute or addHttpRoute from the HttpApi resource
httpApi.addLambdaRoute('/foo/bar', 'FooBar', {
  target: handler,
  method: apigatewayv2.HttpMethod.GET
});

httpApi.addHttpRoute('/foo/bar', 'FooBar', {
  targetUrl: awsUrl,
  method: apigatewayv2.HttpMethod.ANY
});
```

## Integration

Integrations connect a route to backend resources. HTTP APIs support Lambda proxy and HTTP proxy integrations. 
For example, you can configure a POST request to the /signup route of your API to integrate with a Lambda function 
that handles signing up customers. 

Use `Integration` to create the integration resources

```ts
// create API
const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  targetHandler
});
// create Integration
const integ = new apigatewayv2.Integration(stack, 'IntegRootHandler', {
  apiId: api.httpApiId,
  integrationMethod: apigatewayv2.HttpMethod.ANY,
  integrationType: apigatewayv2.IntegrationType.HTTP_PROXY,
  integrationUri: awsUrl
});
// create a specific route with the integration above for the API
new apigatewayv2.Route(stack, 'SomeDeepRoute', {
  api: httpApi,
  httpPath: '/some/very/deep/route/path',
  integration
});

```

You may use `LambdaProxyIntegraion` or `HttpProxyIntegration` to easily create the integrations.

```ts
// create a Lambda proxy integration
new apigatewayv2.LambdaProxyIntegration(stack, 'IntegRootHandler', {
  api
  targetHandler
});

// or create a Http proxy integration
new apigatewayv2.HttpProxyIntegration(stack, 'IntegRootHandler', {
  api
  targetUrl
});
```

## Samples


```ts
// create a HTTP API with HTTP proxy integration as the $default route
const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  targetUrl: checkIpUrl
});
// print the API URL 
new cdk.CfnOutput(stack, 'URL', { value: httpApi.url} );

// create another HTTP API with Lambda proxy integration as the $default route
const httpApi2 = new apigatewayv2.HttpApi(stack, 'HttpApi2', {
  targetHandler: handler
});
// print the API URL 
new cdk.CfnOutput(stack, 'URL2', { value: httpApi2.url });

// create a root route for the API with the integration we created above and assign the route resource
// as a 'root' property to the API
httpApi2.root = httpApi2.addLambdaRoute('/', 'RootRoute', {
  target: rootHandler
})

// Now, extend the route tree from the root
httpApi2.root
  // HTTP ANY /foo
  .addLambdaRoute('foo', 'Foo', {
    target: handler,
  })
  // HTTP ANY /foo/aws
  .addHttpRoute('aws',  'AwsPage', {
    targetUrl: awsUrl,
    method: apigatewayv2.HttpMethod.ANY
  })
  // HTTP GET /foo/aws/checkip
  .addHttpRoute('checkip', 'CheckIp', {
    targetUrl: checkIpUrl,
    method: apigatewayv2.HttpMethod.GET
  });

// And create a specific route for it as well
// HTTP ANY /some/very/deep/route/path
httpApi2.addLambdaRoute('/some/very/deep/route/path', 'FooBar', {
  target: handler
});
```
