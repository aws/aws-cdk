# AWS APIGatewayv2 Authorizers

## Table of Contents

- [Introduction](#introduction)
- [HTTP APIs](#http-apis)
  - [Default Authorization](#default-authorization)
  - [Route Authorization](#route-authorization)
  - [JWT Authorizers](#jwt-authorizers)
    - [User Pool Authorizer](#user-pool-authorizer)
  - [Lambda Authorizers](#lambda-authorizers)
  - [IAM Authorizers](#iam-authorizers)
- [WebSocket APIs](#websocket-apis)
  - [Lambda Authorizer](#lambda-authorizer)
  - [IAM Authorizers](#iam-authorizer)
- [Import Issues](#import-issues)
  - [DotNet Namespace](#dotnet-namespace)
  - [Java Package](#java-package)

## Introduction

API Gateway supports multiple mechanisms for controlling and managing access to your HTTP API. They are mainly
classified into Lambda Authorizers, JWT authorizers, and standard AWS IAM roles and policies. More information is
available at [Controlling and managing access to an HTTP
API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html).

## HTTP APIs

Access control for HTTP APIs is managed by restricting which routes can be invoked via.

Authorizers and scopes can either be applied to the API, or specifically for each route.

### Default Authorization

When using default authorization, all routes of the API will inherit the configuration.

In the example below, all routes will require the `manage:books` scope present in order to invoke the integration.

```ts
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

const issuer = 'https://test.us.auth0.com';
const authorizer = new HttpJwtAuthorizer('DefaultAuthorizer', issuer, {
  jwtAudience: ['3131231'],
});

const api = new apigwv2.HttpApi(this, 'HttpApi', {
  defaultAuthorizer: authorizer,
  defaultAuthorizationScopes: ['manage:books'],
});
```

### Route Authorization

Authorization can also be configured for each Route. When a route authorization is configured, it takes precedence over default authorization.

The example below showcases default authorization, along with route authorization. It also shows how to remove authorization entirely for a route.

- `GET /books` and `GET /books/{id}` use the default authorizer settings on the api
- `POST /books` will require the `['write:books']` scope
- `POST /login` removes the default authorizer (unauthenticated route)

```ts
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const issuer = 'https://test.us.auth0.com';
const authorizer = new HttpJwtAuthorizer('DefaultAuthorizer', issuer, {
  jwtAudience: ['3131231'],
});

const api = new apigwv2.HttpApi(this, 'HttpApi', {
  defaultAuthorizer: authorizer,
  defaultAuthorizationScopes: ['read:books'],
});

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books',
  methods: [apigwv2.HttpMethod.GET],
});

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIdIntegration', 'https://get-books-proxy.example.com'),
  path: '/books/{id}',
  methods: [apigwv2.HttpMethod.GET],
});

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books',
  methods: [apigwv2.HttpMethod.POST],
  authorizationScopes: ['write:books']
});

api.addRoutes({
  integration: new HttpUrlIntegration('LoginIntegration', 'https://get-books-proxy.example.com'),
  path: '/login',
  methods: [apigwv2.HttpMethod.POST],
  authorizer: new apigwv2.HttpNoneAuthorizer(),
});
```

### JWT Authorizers

JWT authorizers allow the use of JSON Web Tokens (JWTs) as part of [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) and [OAuth 2.0](https://oauth.net/2/) frameworks to allow and restrict clients from accessing HTTP APIs.

When configured, API Gateway validates the JWT submitted by the client, and allows or denies access based on its content.

The location of the token is defined by the `identitySource` which defaults to the HTTP `Authorization` header. However it also
[supports a number of other options](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.identity-sources).
It then decodes the JWT and validates the signature and claims, against the options defined in the authorizer and route (scopes).
For more information check the [JWT Authorizer documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html).

Clients that fail authorization are presented with either 2 responses:

- `401 - Unauthorized` - When the JWT validation fails
- `403 - Forbidden` - When the JWT validation is successful but the required scopes are not met

```ts
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const issuer = 'https://test.us.auth0.com';
const authorizer = new HttpJwtAuthorizer('BooksAuthorizer', issuer, {
  jwtAudience: ['3131231'],
});

const api = new apigwv2.HttpApi(this, 'HttpApi');

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books',
  authorizer,
});
```

#### User Pool Authorizer

User Pool Authorizer is a type of JWT Authorizer that uses a Cognito user pool and app client to control who can access your API. After a successful authorization from the app client, the generated access token will be used as the JWT.

Clients accessing an API that uses a user pool authorizer must first sign in to a user pool and obtain an identity or access token.
They must then use this token in the specified `identitySource` for the API call. More information is available at [using Amazon Cognito user
pools as authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html).

```ts
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const userPool = new cognito.UserPool(this, 'UserPool');

const authorizer = new HttpUserPoolAuthorizer('BooksAuthorizer', userPool);

const api = new apigwv2.HttpApi(this, 'HttpApi');

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books',
  authorizer,
});
```

### Lambda Authorizers

Lambda authorizers use a Lambda function to control access to your HTTP API. When a client calls your API, API Gateway invokes your Lambda function and uses the response to determine whether the client can access your API.

Lambda authorizers depending on their response, fall into either two types - Simple or IAM. You can learn about differences [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format-response).


```ts
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

// This function handles your auth logic
declare const authHandler: lambda.Function;

const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', authHandler, {
  responseTypes: [HttpLambdaResponseType.SIMPLE], // Define if returns simple and/or iam response
});

const api = new apigwv2.HttpApi(this, 'HttpApi');

api.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books',
  authorizer,
});
```

### IAM Authorizers

API Gateway supports IAM via the included `HttpIamAuthorizer` and grant syntax:

```ts
import { HttpIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

declare const principal: iam.AnyPrincipal;

const authorizer = new HttpIamAuthorizer();

const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
  defaultAuthorizer: authorizer,
});

const routes = httpApi.addRoutes({
  integration: new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com'),
  path: '/books/{book}',
});

routes[0].grantInvoke(principal);
```

## WebSocket APIs

You can set an authorizer to your WebSocket API's `$connect` route to control access to your API.

### Lambda Authorizer

Lambda authorizers use a Lambda function to control access to your WebSocket API. When a client connects to your API, API Gateway invokes your Lambda function and uses the response to determine whether the client can access your API.

```ts
import { WebSocketLambdaAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

// This function handles your auth logic
declare const authHandler: lambda.Function;

// This function handles your WebSocket requests
declare const handler: lambda.Function;

const authorizer = new WebSocketLambdaAuthorizer('Authorizer', authHandler);

const integration = new WebSocketLambdaIntegration(
  'Integration',
  handler,
);

new apigwv2.WebSocketApi(this, 'WebSocketApi', {
  connectRouteOptions: {
    integration,
    authorizer,
  },
});
```

### IAM Authorizer

IAM authorizers can be used to allow identity-based access to your WebSocket API.

```ts
import { WebSocketIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

// This function handles your connect route
declare const connectHandler: lambda.Function;

const webSocketApi = new apigwv2.WebSocketApi(this, 'WebSocketApi');

webSocketApi.addRoute('$connect', {
  integration: new WebSocketLambdaIntegration('Integration', connectHandler),
  authorizer: new WebSocketIamAuthorizer()
});

// Create an IAM user (identity)
const user = new iam.User(this, 'User');

const webSocketArn = Stack.of(this).formatArn({
  service: 'execute-api',
  resource: webSocketApi.apiId,
});

// Grant access to the IAM user
user.attachInlinePolicy(new iam.Policy(this, 'AllowInvoke', {
  statements: [
    new iam.PolicyStatement({
      actions: ['execute-api:Invoke'],
      effect: iam.Effect.ALLOW,
      resources: [webSocketArn],
    }),
  ],
}));

```

## Import Issues

`jsiirc.json` file is missing during the stablization process of this module, which caused import issues for DotNet and Java users who attempt to use this module. Unfortunately, to guarantee backward compatibility, we cannot simply correct the namespace for DotNet or package for Java. The following outlines the workaround.

### DotNet Namespace

Instead of the conventional namespace `Amazon.CDK.AWS.Apigatewayv2.Authorizers`, you would need to use the following namespace:

```cs
using Amazon.CDK.AwsApigatewayv2Authorizers;;
```

### Java Package

Instead of conventional package `import software.amazon.awscdk.services.apigatewayv2_authorizers.*`, you would need to use the following package:

```java
import software.amazon.awscdk.aws_apigatewayv2_authorizers.*;

// If you want to import a specific construct
import software.amazon.awscdk.aws_apigatewayv2_authorizers.WebSocketIamAuthorizer;
```
