# AWS APIGatewayv2 Integrations
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
  - [Lambda Integration](#lambda)
  - [HTTP Proxy Integration](#http-proxy)
  - [Private Integration](#private-integration)
  - [Request Parameters](#request-parameters)
- [WebSocket APIs](#websocket-apis)
  - [Lambda WebSocket Integration](#lambda-websocket-integration)

## HTTP APIs

Integrations connect a route to backend resources. HTTP APIs support Lambda proxy, AWS service, and HTTP proxy integrations. HTTP proxy integrations are also known as private integrations.

### Lambda

Lambda integrations enable integrating an HTTP API route with a Lambda function. When a client invokes the route, the
API Gateway service forwards the request to the Lambda function and returns the function's response to the client.

The API Gateway service will invoke the lambda function with an event payload of a specific format. The service expects
the function to respond in a specific format. The details on this format is available at [Working with AWS Lambda
proxy integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html).

The following code configures a route `GET /books` with a Lambda proxy integration.

```ts
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

declare const booksDefaultFn: lambda.Function;
const booksIntegration = new HttpLambdaIntegration('BooksIntegration', booksDefaultFn);

const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

httpApi.addRoutes({
  path: '/books',
  methods: [ apigwv2.HttpMethod.GET ],
  integration: booksIntegration,
});
```

### HTTP Proxy

HTTP Proxy integrations enables connecting an HTTP API route to a publicly routable HTTP endpoint. When a client
invokes the route, the API Gateway service forwards the entire request and response between the API Gateway endpoint
and the integrating HTTP endpoint. More information can be found at [Working with HTTP proxy
integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html).

The following code configures a route `GET /books` with an HTTP proxy integration to an HTTP endpoint
`get-books-proxy.example.com`.

```ts
import { HttpUrlIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

const booksIntegration = new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com');

const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

httpApi.addRoutes({
  path: '/books',
  methods: [ apigwv2.HttpMethod.GET ],
  integration: booksIntegration,
});
```

### Private Integration

Private integrations enable integrating an HTTP API route with private resources in a VPC, such as Application Load Balancers or
Amazon ECS container-based applications.  Using private integrations, resources in a VPC can be exposed for access by
clients outside of the VPC.

The following integrations are supported for private resources in a VPC.

#### Application Load Balancer

The following code is a basic application load balancer private integration of HTTP API:

```ts
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

const vpc = new ec2.Vpc(this, 'VPC');
const lb = new elbv2.ApplicationLoadBalancer(this, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegration('DefaultIntegration', listener),
});
```

When an imported load balancer is used, the `vpc` option must be specified for `HttpAlbIntegration`.

#### Network Load Balancer

The following code is a basic network load balancer private integration of HTTP API:

```ts
import { HttpNlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

const vpc = new ec2.Vpc(this, 'VPC');
const lb = new elbv2.NetworkLoadBalancer(this, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpNlbIntegration('DefaultIntegration', listener),
});
```

When an imported load balancer is used, the `vpc` option must be specified for `HttpNlbIntegration`.

#### Cloud Map Service Discovery

The following code is a basic discovery service private integration of HTTP API:

```ts
import * as servicediscovery from '@aws-cdk/aws-servicediscovery';
import { HttpServiceDiscoveryIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

const vpc = new ec2.Vpc(this, 'VPC');
const vpcLink = new apigwv2.VpcLink(this, 'VpcLink', { vpc });
const namespace = new servicediscovery.PrivateDnsNamespace(this, 'Namespace', {
  name: 'boobar.com',
  vpc,
});
const service = namespace.createService('Service');

const httpEndpoint = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpServiceDiscoveryIntegration('DefaultIntegration', service, {
    vpcLink,
  }),
});
```

### Request Parameters

Request parameter mapping allows API requests from clients to be modified before they reach backend integrations.
Parameter mapping can be used to specify modifications to request parameters. See [Transforming API requests and
responses](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html).

The following example creates a new header - `header2` - as a copy of `header1` and removes `header1`.

```ts
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

declare const lb: elbv2.ApplicationLoadBalancer;
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegration('DefaultIntegration', listener, {
    parameterMapping: new apigwv2.ParameterMapping()
      .appendHeader('header2', apigwv2.MappingValue.requestHeader('header1'))
      .removeHeader('header1'),
  }),
});
```

To add mapping keys and values not yet supported by the CDK, use the `custom()` method:

```ts
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

declare const lb: elbv2.ApplicationLoadBalancer;
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', {
  port: 80,
});

const httpEndpoint = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegration('DefaultIntegration', listener, {
    parameterMapping: new apigwv2.ParameterMapping().custom('myKey', 'myValue'),
  }),
});
```


## WebSocket APIs

WebSocket integrations connect a route to backend resources. The following integrations are supported in the CDK.

### Lambda WebSocket Integration

Lambda integrations enable integrating a WebSocket API route with a Lambda function. When a client connects/disconnects
or sends message specific to a route, the API Gateway service forwards the request to the Lambda function

The API Gateway service will invoke the lambda function with an event payload of a specific format.

The following code configures a `sendmessage` route with a Lambda integration

```ts
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
new apigwv2.WebSocketStage(this, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

declare const messageHandler: lambda.Function;
webSocketApi.addRoute('sendmessage', {
  integration: new WebSocketLambdaIntegration('SendMessageIntegration', messageHandler),
});
```
