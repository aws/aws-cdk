## AWS::APIGatewayv2 Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

## Introduction

Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket
APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud.
As an API Gateway API developer, you can create APIs for use in your own client applications. Read the
[Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html).

This module supports features under [API Gateway v2](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ApiGatewayV2.html)
that lets users set up Websocket and HTTP APIs.
REST APIs can be created using the `@aws-cdk/aws-apigateway` module.

## HTTP API

HTTP APIs enable creation of RESTful APIs that integrate with AWS Lambda functions, known as Lambda proxy integration,
or to any routable HTTP endpoint, known as HTTP proxy integration.

Use `HttpApi` to create HTTP APIs with HTTP proxy integration as the `defaultIntegration`

```ts
new HttpApi(stack, 'HttpProxyApi', {
  defaultIntegration: new HttpProxyIntegration({
    url:'http://example.com',
  }),
});
```

To create HTTP APIs with Lambda proxy integration as the `defaultIntegration`

```ts
new HttpApi(stack, 'LambdaProxyApi', {
    defaultIntegration: new LambdaProxyIntegration({
      handler,
    }),
});
```

To create HTTP APIs with no default integration 

```ts
new HttpApi(stack, 'Api');
});
```



Read more about [Working with AWS Lambda Proxy Integrations for HTTP
APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)
and [Working with HTTP Proxy Integrations for HTTP
APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html).



## Route

Routes direct incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource path—for example,
`GET /books`. You can define specific HTTP methods for your route, or use the `ANY` method to match all methods that you haven't defined for a resource.
You can create a `$default route` that acts as a catch-all for requests that don’t match any other routes. See
[Working with Routes for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html).

When you create HTTP APIs with `defaultIntegration`, the `$default route` will be created as well.

Use `HttpRoute` to create a `Route` resource for HTTP APIs and `HttpRouteKey` to define your route key.


```ts
new HttpRoute(stack, 'HttpRoute', {
  httpApi,
  integration,
  routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
});
```


## Stage 

A stage is a named reference to a deployment, which is a snapshot of the API. You use a `Stage` to manage and optimize a particular deployment. 

Use `HttpStage` to create a `Stage` resource for HTTP APIs

```ts
new HttpStage(stack, 'Stage', {
  httpApi: api,
  stageName: 'beta',
});
```

If you omit the `stageName`, the `$default` stage will be created.

Please note when you create `HttpApi` resource, the `$default` stage will be created as well unless you set `createDefaultStage` to `false`.

```ts
// create HttpApi without $default stage
const api = new HttpApi(stack, 'Api', {
  createDefaultStage: false,
});

// create the $default stage for it
new HttpStage(stack, 'Stage', {
  httpApi: api,
});

```

## Defining APIs

APIs are defined as a hierarchy of routes. `addRoutes` can be used to build this hierarchy.

For example, the following code defines an API that includes the following HTTP endpoints: `ANY /`, `GET /books`, `POST /books`, `GET /books/{book_id}` and `DELETE /books/{book_id}`.

```ts
const httpApi = new HttpApi(this, 'HttpApi', {
    defaultIntegration: new LambdaProxyIntegration({
      rootHandler,
    }),
});

// GET or POST /books
httpApi.addRoutes({
  path: '/books',
  methods: [ HttpMethod.GET, HttpMethod.POST ],
  integration: new LambdaProxyIntegration({
    handler,
  }),
});


// GET or DELETE {book_id}
httpApi.addRoutes({
  path: '/books/{book_id}',
  methods: [ HttpMethod.GET, HttpMethod.DELETE ],
  integration: new LambdaProxyIntegration({
    handler,
  }),
});

```
