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

Amazon API Gateway V2 is a fully managed service that makes it easy for developers
to publish, maintain, monitor, and secure Web Socket or HTTP APIs at any scale. Create an API to
access data, business logic, or functionality from your back-end services, such
as applications running on Amazon Elastic Compute Cloud (Amazon EC2), code
running on AWS Lambda, or any web application.

### Defining APIs

APIs are defined through adding routes, and integrating them with AWS Services or APIs.
Currently this module supports HTTP APIs and Web Socket APIs.

For example a Web Socket API with a "$connect" route (handling user connection) backed by
an AWS Lambda function would be defined as follows:

```ts
const api = new apigatewayv2.Api(this, 'books-api', {
  protocolType: apigatewayv2.ProtocolType.HTTP
});

const backend = new lambda.Function(...);
const integration = api.addLambdaIntegration('myFunction', {
  handler: backend
});

integration.addRoute('POST /');
```

You can also supply `proxy: false`, in which case you will have to explicitly
define the API model:

```ts
const backend = new lambda.Function(...);
const integration = api.addLambdaIntegration('myFunction', {
  handler: backend,
  proxy: false
});
```

### Integration Targets

Methods are associated with backend integrations, which are invoked when this
method is called. API Gateway supports the following integrations:

 * `LambdaIntegration` - can be used to invoke an AWS Lambda function.

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

const api = new apigatewayv2.Api(this, 'hello-api', {
  protocolType: apigatewayv2.ProtocolType.WEBSOCKET,
  apiKeySelectionExpression: '$request.header.x-api-key'
});
```

### Working with models

When you work with Lambda integrations that are not Proxy integrations, you
have to define your models and mappings for the request, response, and integration.

```ts
const hello = new lambda.Function(...);

const api = new apigateway.RestApi(this, 'hello-api', {
  protocolType: apigatewayv2.ProtocolType.HTTP
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

----

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
