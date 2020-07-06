## AWS::APIGatewayv2 Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

## Table of Contents

- [Introduction](#introduction)
- [HTTP API](#http-api)
  - [Defining HTTP APIs](#defining-http-apis)
  - [Cross Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  - [Publishing HTTP APIs](#publishing-http-apis)
  - [Custom Domain](#custom-domain)

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

### Defining HTTP APIs

HTTP APIs have two fundamental concepts - Routes and Integrations.

Routes direct incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource
path, such as, `GET /books`. Learn more at [Working with
routes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html). Use the `ANY` method
to match any methods for a route that are not explicitly defined.

Integrations define how the HTTP API responds when a client reaches a specific Route. HTTP APIs support two types of
integrations - Lambda proxy integration and HTTP proxy integration. Learn more at [Configuring
integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations.html).

The code snippet below configures a route `GET /books` with an HTTP proxy integration and uses the `ANY` method to
proxy all other HTTP method calls to `/books` to a lambda proxy.

```ts
const getBooksIntegration = new HttpProxyIntegration({
  url: 'https://get-books-proxy.myproxy.internal',
});

const booksDefaultFn = new lambda.Function(stack, 'BooksDefaultFn', { ... });
const booksDefaultIntegration = new LambdaProxyIntegration({
  handler: booksDefaultFn,
});

const httpApi = new HttpApi(stack, 'HttpApi');

httpApi.addRoutes({
  path: '/books',
  methods: [ HttpMethod.GET ],
  integration: getBooksIntegration,
});
httpApi.addRoutes({
  path: '/books',
  methods: [ HttpMethod.ANY ],
  integration: booksDefaultIntegration,
});
```

The `defaultIntegration` option while defining HTTP APIs lets you create a default catch-all integration that is
matched when a client reaches a route that is not explicitly defined.

```ts
new HttpApi(stack, 'HttpProxyApi', {
  defaultIntegration: new HttpProxyIntegration({
    url:'http://example.com',
  }),
});
```

### Cross Origin Resource Sharing (CORS)

[Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a browser security
feature that restricts HTTP requests that are initiated from scripts running in the browser. Enabling CORS will allow
requests to your API from a web application hosted in a domain different from your API domain.

When configured CORS for an HTTP API, API Gateway automatically sends a response to preflight `OPTIONS` requests, even
if there isn't an `OPTIONS` route configured. Note that, when this option is used, API Gateway will ignore CORS headers
returned from your backend integration. Learn more about [Configuring CORS for an HTTP
API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).

The `corsPreflight` option lets you specify a CORS configuration for an API.

```ts
new HttpApi(stack, 'HttpProxyApi', {
  corsPreflight: {
    allowCredentials: true,
    allowHeaders: ['Authorization'],
    allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST],
    allowOrigins: ['*'],
    maxAge: Duration.days(10),
  },
});
```

### Publishing HTTP APIs

A Stage is a logical reference to a lifecycle state of your API (for example, `dev`, `prod`, `beta`, or `v2`). API
stages are identified by their stage name. Each stage is a named reference to a deployment of the API made available for
client applications to call.

Use `HttpStage` to create a Stage resource for HTTP APIs. The following code sets up a Stage, whose URL is available at
`https://{api_id}.execute-api.{region}.amazonaws.com/beta`.

```ts
new HttpStage(stack, 'Stage', {
  httpApi: api,
  stageName: 'beta',
});
```

If you omit the `stageName` will create a `$default` stage. A `$default` stage is one that is served from the base of
the API's URL - `https://{api_id}.execute-api.{region}.amazonaws.com/`.

Note that, `HttpApi` will always creates a `$default` stage, unless the `createDefaultStage` property is unset.



### Custom Domain

Custom domain names are simpler and more intuitive URLs that you can provide to your API users. Custom domain name are associated to API stages.

The code snippet below creates a custom domain and configures a default domain mapping for your API that maps the
custom domain to the `$default` stage of the API.

```ts
const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const domainName = 'example.com';

const dn = new DomainName(stack, 'DN', {
  domainName,
  certificate: acm.Certificate.fromCertificateArn(stack, 'cert', certArn),
});

const api = new HttpApi(stack, 'HttpProxyProdApi', {
  defaultIntegration: new LambdaProxyIntegration({ handler }),
  // https://${dn.domainName} goes to prodApi $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: '/',
  },
});
```

To associate a specifc `Stage` to a custom domain mapping -

```ts
api.addStage('beta', {
  stageName: 'beta',
  autoDeploy: true,
  // https://${dn.domainName}/beta goes to the beta stage
  domainMapping: {
    domainName: dn,
    mappingKey: 'beta',
  },
});
```

The same domain name can be associated with stages across different `HttpApi` as so -

```ts
const apiDemo = new HttpApi(stack, 'DemoApi', {
  defaultIntegration: new LambdaProxyIntegration({ handler }),
  // https://${dn.domainName}/demo goes to apiDemo $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'demo',
  },
});
```

The `mappingKey` determines the `path` of the URL with the custom domain. Each custom domain is only allowed
to have one API mapping with the root(/) `mappingKey`. In the sample above, the custom domain is associated
with 3 API mapping resources across different APIs and Stages.

|        API     |     Stage   |   URL  |
| :------------: | :---------: | :----: |
| api | $default  |   `https://${domainName}`  |
| api | beta  |   `https://${domainName}/beta`  |
| apiDemo | $default  |   `https://${domainName}/demo`  |
