## AWS::APIGatewayv2 Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

Amazon API Gateway V2 is a fully managed service that makes it easy for developers
to publish, maintain, monitor, and secure Web Socket or HTTP APIs at any scale. Create an API to
access data, business logic, or functionality from your back-end services, such
as applications running on Amazon Elastic Compute Cloud (Amazon EC2), code
running on AWS Lambda, or any web application.

### Defining APIs

APIs are defined through adding routes, and integrating them with AWS Services or APIs.
Currently this module supports HTTP APIs and Web Socket APIs.

The module defines a broad 'Api' L2 Resource that maps closely to the L1 CloudFormation resource
but also provides a 'HttpApi' and 'WebSocketApi' constructs that provide additional support such
as clear definitions of what is allowed in HTTP or WebSocket APIs, and helper methods
to accelerate development. We recommend leveragint these constructs.

For example a Web Socket API with a "$default" route (handling user connection) backed by
an AWS Lambda function would be defined as follows:

```ts
const api = new apigatewayv2.WebSocketApi(this, 'books-api', {
  // Gets the context from the WebSocket header
  routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
});

const backend = new lambda.Function(...);
const integration = api.addLambdaIntegration('myFunction', {
  handler: backend,
});

api.addRoute('$connect', integration);
```

An HTTP API to get a book by its ID would be provided as:

```ts
const api = new apigatewayv2.HttpApi(this, 'books-api');

const backend = new lambda.Function(...);
const integration = api.addLambdaIntegration('myFunction', {
  handler: backend,
});

api.addRoute('GET /book/{book_id}', integration);
```

APIs also support the automated creation of a '$default' (catch-all) route,
automatically, through the 'defaultHandler' property.

```ts
const backend = new lambda.Function(...);

const api = new apigatewayv2.HttpApi(this, 'books-api', {
  defaultTarget: { handler: backend },
});
```

### Integration Targets

Methods are associated with backend integrations, which are invoked when this
method is called. API Gateway supports the following integrations:

 * `LambdaIntegration` - can be used to invoke an AWS Lambda function.
 * `ServiceIntegration` - can be used to invoke an AWS Service.
 * `HttpIntegration` - can be used to invoke an HTTP API ont he backend.
 * `MockIntegration` - can be used to leverage Mocks for Web Scket APIs.

The following example shows how to integrate the `GET /book/{book_id}` method to
an AWS Lambda function:

```ts
const getBookHandler = new lambda.Function(...);
const getBookIntegration = api.addLambdaIntegration('myFunction', {
  handler: getBookHandler
});
```

The following example shows how to use an API Key with a usage plan:

```ts
const hello = new lambda.Function(...);

const api = new apigatewayv2.WebSocketApi(this, 'hello-api', {
  routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
  apiKeySelectionExpression: apigw.KnownApiKeySelectionExpression.HEADER_X_API_KEY,
});
```

### Working with models in WebSocket APIs

When you work with Lambda integrations that are not Proxy integrations, you
have to define your models and mappings for the request, response, and integration.

```ts
const hello = new lambda.Function(...);

const api = new apigateway.WebSocketApi(this, 'hello-api', {
  routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
});

const integration = api.addLambdaIntegration('myFunction', {
  handler: hello
});
integration.addRoute(apigw.KnownRouteKey.CONNECT, {
  modelSelectionExpression: apigw.KnownModelKey.DEFAULT,
  requestModels: {
    $default: api.addModel({ schema: apigw.JsonSchemaVersion.DRAFT4, title: "statusInputModel", type: apigw.JsonSchemaType.OBJECT, properties: { action: { type: apigw.JsonSchemaType.STRING } } })
  },
  routeResponseSelectionExpression: apigw.KnownRouteResponseKey.DEFAULT
});
```
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

For more information about `REST APIs`, see [Working with REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html). 
To create [REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html) with AWS CDK, use `@aws-cdk/aws-apigateway` instead.


### HTTP API

HTTP APIs enable you to create RESTful APIs that integrate with AWS Lambda functions or to any routable HTTP endpoint.

HTTP API supports both Lambda proxy integration and HTTP proxy integration. 
See [Working with AWS Lambda Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) 
and [Working with HTTP Proxy Integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html) 
for more information.



Use `HttpApi` to create HTTP APIs with Lambda or HTTP proxy integration. The $default route will be created as well that acts as a catch-all for requests that don’t match any other routes. 


```ts
// Create a vanilla HTTP API with no integration targets
new apigatewayv2.HttpApi(stack, 'HttpApi1');

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

Routes direct incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource path—for example, 
`GET /pets`. You can define specific HTTP methods for your route, or use the `ANY` method to match all methods that you haven't defined for a resource. 
You can create a `$default route` that acts as a catch-all for requests that don’t match any other routes. See 
[Working with Routes for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html).

When you create HTTP APIs with either `Lambda Proxy Integration` or `HTTP Proxy Integration`, the `$default route` will be created as well.


## Defining APIs

APIs are defined as a hierarchy of routes. `addLambdaRoute` and `addHttpRoute` can be used to build this hierarchy. The root resource is `api.root`.

For example, the following code defines an API that includes the following HTTP endpoints: ANY /, GET /books, POST /books, GET /books/{book_id}, DELETE /books/{book_id}.

```ts
const checkIpUrl = 'https://checkip.amazonaws.com';
const awsUrl = 'https://aws.amazon.com';

const api = new apigatewayv2.HttpApi(this, 'HttpApi');
api.root

api.root
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
api.addServiceIntegration('IntegRootHandler', {
  integrationMethod: apigatewayv2.HttpMethod.ANY,
  url: awsUrl,
  proxy: true,
});

// create a specific route with the integration above for the API
api.addRoute({ path: '/some/very/deep/route/path' }, integration);

```

You may use `LambdaProxyIntegraion` or `HttpProxyIntegration` to easily create the integrations.

```ts
// create a Lambda proxy integration
api.addLambdaIntegration('IntegRootHandler', {
  targetHandler,
  proxy: true,
});

// or create a Http proxy integration
api.addHttpIntegration('IntegRootHandler', {
  targetUrl,
  proxy: true,
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

----

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
