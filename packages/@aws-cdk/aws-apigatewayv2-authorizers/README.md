# AWS APIGatewayv2 Authorizers

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## Table of Contents

- [Introduction](#introduction)
- [HTTP APIs](#http-apis)
  - [Default Authorization](#default-authorization)
  - [Route Authorization](#route-authorization)
- [JWT Authorizers](#jwt-authorizers)
  - [User Pool Authorizer](#user-pool-authorizer)

## Introduction

API Gateway supports multiple mechanisms for controlling and managing access to your HTTP API. They are mainly
classified into Lambda Authorizers, JWT authorizers and standard AWS IAM roles and policies. More information is
available at [Controlling and managing access to an HTTP
API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html).

## HTTP APIs

Access control for Http Apis is managed by restricting which routes can be invoked via.

Authorizers, and scopes can either be applied to the api, or specifically for each route.

### Default Authorization

When using default authorization, all routes of the api will inherit the configuration.

In the example below, all routes will require the `manage:books` scope present in order to invoke the integration.

```ts
const authorizer = new HttpJwtAuthorizer({
  ...
});

const api = new HttpApi(stack, 'HttpApi', {
  defaultAuthorizer: authorizer,
  defaultAuthorizationScopes: ['manage:books'],
});
```

### Route Authorization

Authorization can also configured for each Route. When a route authorization is configured, it takes precedence over default authorization.

The example below showcases default authorization, along with route authorization. It also shows how to remove authorization entirely for a route.

- `GET /books` and `GET /books/{id}` use the default authorizer settings on the api
- `POST /books` will require the [write:books] scope
- `POST /login` removes the default authorizer (unauthenticated route)

```ts
const authorizer = new HttpJwtAuthorizer({
  ...
});

const api = new HttpApi(stack, 'HttpApi', {
  defaultAuthorizer: authorizer,
  defaultAuthorizationScopes: ['read:books'],
});

api.addRoutes({
  ...
  path: '/books',
  method: 'get',
});

api.addRoutes({
  ...
  path: '/books/{id}',
  method: 'get',
});

api.addRoutes({
  ...
  path: '/books',
  method: 'post',
  authorizationScopes: ['write:books']
});

api.addRoutes({
  ...
  path: '/login',
  method: 'post',
  authorizer: new NoneAuthorizer(),
});
```

## JWT Authorizers

JWT authorizers allow the use of JSON Web Tokens (JWTs) as part of [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) and [OAuth 2.0](https://oauth.net/2/) frameworks to allow and restrict clients from accessing HTTP APIs.

When configured, API Gateway validates the JWT submitted by the client, and allows or denies access based on its content.

The location of the token is defined by the `identitySource` which defaults to the http `Authorization` header. However it also
[supports a number of other options](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.identity-sources).
It then decodes the JWT and validates the signature and claims, against the options defined in the authorizer and route (scopes).
For more information check the [JWT Authorizer documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html).

Clients that fail authorization are presented with either 2 responses:

- `401 - Unauthorized` - When the JWT validation fails
- `403 - Forbidden` - When the JWT validation is successful but the required scopes are not met

```ts
const authorizer = new HttpJwtAuthorizer({
  jwtAudience: ['3131231'],
  jwtIssuer: 'https://test.us.auth0.com',
});

const api = new HttpApi(stack, 'HttpApi');

api.addRoutes({
  integration: new HttpProxyIntegration({
    url: 'https://get-books-proxy.myproxy.internal',
  }),
  path: '/books',
  authorizer,
});
```

### User Pool Authorizer

User Pool Authorizer is a type of JWT Authorizer that uses a Cognito user pool and app client to control who can access your Api. After a successful authorization from the app client, the generated access token will be used as the JWT.

Clients accessing an API that uses a user pool authorizer must first sign in to a user pool and obtain an identity or access token.
They must then use this token in the specified `identitySource` for the API call. More information is available at [using Amazon Cognito user
pools as authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html).

```ts
const userPool = new UserPool(stack, 'UserPool');
const userPoolClient = userPool.addClient('UserPoolClient');

const authorizer = new HttpUserPoolAuthorizer({
  userPool,
  userPoolClient,
});

const api = new HttpApi(stack, 'HttpApi');

api.addRoutes({
  integration: new HttpProxyIntegration({
    url: 'https://get-books-proxy.myproxy.internal',
  }),
  path: '/books',
  authorizer,
});
```
