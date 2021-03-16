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

- [HTTP APIs](#http-apis)
- [JWT Authorizers](#jwt-authorizers)
  - [User Pool Authorizer](#user-pool-authorizer)

## HTTP APIs

API Gateway supports multiple mechanisms for controlling and managing access to your HTTP API. They are mainly
classified into Lambda Authorizers, JWT authorizers and standard AWS IAM roles and policies. More information is
available at [Controlling and managing access to an HTTP
API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html).

## JWT Authorizers

JWT authorizers allow the use of JSON Web Tokens (JWTs) as part of [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) and [OAuth 2.0](https://oauth.net/2/) frameworks to allow and restrict clients from accessing HTTP APIs.

When configured on a route, the API Gateway service validates the JWTs submitted by the client, and allows or denies access based on its content.

API gateway uses the `identitySource` to determine where to look for the token. By default it checks the http `Authorization` header. However it also [supports a number of other options](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.identity-sources). It then decodes the JWT and validates the signature and claims, against the options defined in the authorizer and route (scopes). For more information check the [JWT Authorizer documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html).

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
They must then use this token in the `Authorization` header of the API call. More information is available at [using Amazon Cognito user
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
