# AWS APIGatewayv2 Construct Library

## Table of Contents

- [Introduction](#introduction)
- [HTTP API](#http-api)
  - [Defining HTTP APIs](#defining-http-apis)
  - [Cross Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  - [Publishing HTTP APIs](#publishing-http-apis)
  - [Custom Domain](#custom-domain)
  - [Mutual TLS](#mutual-tls-mtls)
  - [Managing access to HTTP APIs](#managing-access-to-http-apis)
  - [Metrics](#metrics)
  - [VPC Link](#vpc-link)
  - [Private Integration](#private-integration)
  - [Generating ARN for Execute API](#generating-arn-for-execute-api)
- [WebSocket API](#websocket-api)
  - [Manage Connections Permission](#manage-connections-permission)
  - [Managing access to WebSocket APIs](#managing-access-to-websocket-apis)

## Introduction

Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket
APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud.
As an API Gateway API developer, you can create APIs for use in your own client applications. Read the
[Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html).

This module supports features under [API Gateway v2](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ApiGatewayV2.html)
that lets users set up Websocket and HTTP APIs.
REST APIs can be created using the `aws-cdk-lib/aws-apigateway` module.

HTTP and Websocket APIs use the same CloudFormation resources under the hood. However, this module separates them into two separate constructs for a more efficient abstraction since there are a number of CloudFormation properties that specifically apply only to each type of API.

## HTTP API

HTTP APIs enable creation of RESTful APIs that integrate with AWS Lambda functions, known as Lambda proxy integration,
or to any routable HTTP endpoint, known as HTTP proxy integration.

### Defining HTTP APIs

HTTP APIs have two fundamental concepts - Routes and Integrations.

Routes direct incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource
path, such as, `GET /books`. Learn more at [Working with
routes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html). Use the `ANY` method
to match any methods for a route that are not explicitly defined.

Integrations define how the HTTP API responds when a client reaches a specific Route. HTTP APIs support Lambda proxy
integration, HTTP proxy integration and, AWS service integrations, also known as private integrations. Learn more at
[Configuring integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations.html).

Integrations are available at the `aws-apigatewayv2-integrations` module and more information is available in that module.
As an early example, we have a website for a bookstore where the following code snippet configures a route `GET /books` with an HTTP proxy integration. All other HTTP method calls to `/books` route to a default lambda proxy for the bookstore.

```ts
import { HttpUrlIntegration, HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const getBooksIntegration = new HttpUrlIntegration('GetBooksIntegration', 'https://get-books-proxy.example.com');

declare const bookStoreDefaultFn: lambda.Function;
const bookStoreDefaultIntegration = new HttpLambdaIntegration('BooksIntegration', bookStoreDefaultFn);

const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

httpApi.addRoutes({
  path: '/books',
  methods: [ apigwv2.HttpMethod.GET ],
  integration: getBooksIntegration,
});
httpApi.addRoutes({
  path: '/books',
  methods: [ apigwv2.HttpMethod.ANY ],
  integration: bookStoreDefaultIntegration,
});
```

The URL to the endpoint can be retrieved via the `apiEndpoint` attribute. By default this URL is enabled for clients. Use `disableExecuteApiEndpoint` to disable it.

```ts
const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
  disableExecuteApiEndpoint: true,
});
```

The `defaultIntegration` option while defining HTTP APIs lets you create a default catch-all integration that is
matched when a client reaches a route that is not explicitly defined.

```ts
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

new apigwv2.HttpApi(this, 'HttpProxyApi', {
  defaultIntegration: new HttpUrlIntegration('DefaultIntegration', 'https://example.com'),
});
```

The `routeSelectionExpression` option allows configuring the HTTP API to accept only `${request.method} ${request.path}`. Setting it to `true` automatically applies this value.

```ts
new apigwv2.HttpApi(this, 'HttpProxyApi', {
  routeSelectionExpression: true,
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
new apigwv2.HttpApi(this, 'HttpProxyApi', {
  corsPreflight: {
    allowHeaders: ['Authorization'],
    allowMethods: [
      apigwv2.CorsHttpMethod.GET,
      apigwv2.CorsHttpMethod.HEAD,
      apigwv2.CorsHttpMethod.OPTIONS,
      apigwv2.CorsHttpMethod.POST,
    ],
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
declare const api: apigwv2.HttpApi;

new apigwv2.HttpStage(this, 'Stage', {
  httpApi: api,
  stageName: 'beta',
  description: 'My Stage',
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
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const domainName = 'example.com';

const dn = new apigwv2.DomainName(this, 'DN', {
  domainName: domainName,
  certificate: acm.Certificate.fromCertificateArn(this, 'cert', certArn),
});

declare const handler: lambda.Function;
const api = new apigwv2.HttpApi(this, 'HttpProxyProdApi', {
  defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', handler),
  // https://${dn.domainName}/foo goes to prodApi $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'foo',
  },
});
```

To migrate a domain endpoint from one type to another, you can add a new endpoint configuration via `addEndpoint()`
and then configure DNS records to route traffic to the new endpoint. After that, you can remove the previous endpoint configuration. 
Learn more at [Migrating a custom domain name](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-migrate.html)

To associate a specific `Stage` to a custom domain mapping -

```ts
declare const api: apigwv2.HttpApi;
declare const dn: apigwv2.DomainName;

api.addStage('beta', {
  stageName: 'beta',
  autoDeploy: true,
  // https://${dn.domainName}/bar goes to the beta stage
  domainMapping: {
    domainName: dn,
    mappingKey: 'bar',
  },
});
```

The same domain name can be associated with stages across different `HttpApi` as so -

```ts
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

declare const handler: lambda.Function;
declare const dn: apigwv2.DomainName;

const apiDemo = new apigwv2.HttpApi(this, 'DemoApi', {
  defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', handler),
  // https://${dn.domainName}/demo goes to apiDemo $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'demo',
  },
});
```

The `mappingKey` determines the base path of the URL with the custom domain. Each custom domain is only allowed
to have one API mapping with undefined `mappingKey`. If more than one API mappings are specified, `mappingKey` will be required for all of them. In the sample above, the custom domain is associated
with 3 API mapping resources across different APIs and Stages.

|        API     |     Stage   |   URL  |
| :------------: | :---------: | :----: |
| api | $default  |   `https://${domainName}/foo`  |
| api | beta  |   `https://${domainName}/bar`  |
| apiDemo | $default  |   `https://${domainName}/demo`  |

You can retrieve the full domain URL with mapping key using the `domainUrl` property as so -

```ts
declare const apiDemo: apigwv2.HttpApi;
const demoDomainUrl = apiDemo.defaultStage?.domainUrl; // returns "https://example.com/demo"
```

### Mutual TLS (mTLS)

Mutual TLS can be configured to limit access to your API based by using client certificates instead of (or as an extension of) using authorization headers.

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const domainName = 'example.com';
declare const bucket: s3.Bucket;

new apigwv2.DomainName(this, 'DomainName', {
  domainName,
  certificate: acm.Certificate.fromCertificateArn(this, 'cert', certArn),
  mtls: {
    bucket,
    key: 'someca.pem',
    version: 'version',
  },
});
```

Instructions for configuring your trust store can be found [here](https://aws.amazon.com/blogs/compute/introducing-mutual-tls-authentication-for-amazon-api-gateway/)

### Managing access to HTTP APIs

API Gateway supports multiple mechanisms for [controlling and managing access to your HTTP
API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html) through authorizers.

These authorizers can be found in the [APIGatewayV2-Authorizers](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2_authorizers-readme.html) constructs library.

### Metrics

The API Gateway v2 service sends metrics around the performance of HTTP APIs to Amazon CloudWatch.
These metrics can be referred to using the metric APIs available on the `HttpApi` construct.
The APIs with the `metric` prefix can be used to get reference to specific metrics for this API. For example,
the method below refers to the client side errors metric for this API.

```ts
const api = new apigwv2.HttpApi(this, 'my-api');
const clientErrorMetric = api.metricClientError();
```

Please note that this will return a metric for all the stages defined in the api. It is also possible to refer to metrics for a specific Stage using
the `metric` methods from the `Stage` construct.

```ts
const api = new apigwv2.HttpApi(this, 'my-api');
const stage = new apigwv2.HttpStage(this, 'Stage', {
  httpApi: api,
});
const clientErrorMetric = stage.metricClientError();
```

### VPC Link

Private integrations let HTTP APIs connect with AWS resources that are placed behind a VPC. These are usually Application
Load Balancers, Network Load Balancers or a Cloud Map service. The `VpcLink` construct enables this integration.
The following code creates a `VpcLink` to a private VPC.

```ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const vpc = new ec2.Vpc(this, 'VPC');
const alb = new elb.ApplicationLoadBalancer(this, 'AppLoadBalancer', { vpc });

const vpcLink = new apigwv2.VpcLink(this, 'VpcLink', { vpc });

// Creating an HTTP ALB Integration:
const albIntegration = new HttpAlbIntegration('ALBIntegration', alb.listeners[0], {});
```

Any existing `VpcLink` resource can be imported into the CDK app via the `VpcLink.fromVpcLinkAttributes()`.

```ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';

declare const vpc: ec2.Vpc;
const awesomeLink = apigwv2.VpcLink.fromVpcLinkAttributes(this, 'awesome-vpc-link', {
  vpcLinkId: 'us-east-1_oiuR12Abd',
  vpc,
});
```

### Private Integration

Private integrations enable integrating an HTTP API route with private resources in a VPC, such as Application Load Balancers or
Amazon ECS container-based applications.  Using private integrations, resources in a VPC can be exposed for access by
clients outside of the VPC.

These integrations can be found in the [aws-apigatewayv2-integrations](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2_integrations-readme.html) constructs library.

### Generating ARN for Execute API

The arnForExecuteApi function in AWS CDK is designed to generate Amazon Resource Names (ARNs) for Execute API operations. This is particularly useful when you need to create ARNs dynamically based on different parameters like HTTP method, API path, and stage.

```ts
const api = new apigwv2.HttpApi(this, 'my-api');
const arn = api.arnForExecuteApi('GET', '/myApiPath', 'dev');
```

- Ensure that the path parameter, if provided, starts with '/'.
- The 'ANY' method can be used for matching any HTTP methods not explicitly defined.
- The function gracefully handles undefined parameters by using wildcards, making it flexible for various API configurations.

## WebSocket API

A WebSocket API in API Gateway is a collection of WebSocket routes that are integrated with backend HTTP endpoints, 
Lambda functions, or other AWS services. You can use API Gateway features to help you with all aspects of the API 
lifecycle, from creation through monitoring your production APIs. [Read more](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html)

WebSocket APIs have two fundamental concepts - Routes and Integrations.

WebSocket APIs direct JSON messages to backend integrations based on configured routes. (Non-JSON messages are directed 
to the configured `$default` route.)

Integrations define how the WebSocket API behaves when a client reaches a specific Route. Learn more at
[Configuring integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-requests.html).

Integrations are available in the `aws-apigatewayv2-integrations` module and more information is available in that module.

To add the default WebSocket routes supported by API Gateway (`$connect`, `$disconnect` and `$default`), configure them as part of api props:

```ts
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

declare const connectHandler: lambda.Function;
declare const disconnectHandler: lambda.Function;
declare const defaultHandler: lambda.Function;

const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi', {
  connectRouteOptions: { integration: new WebSocketLambdaIntegration('ConnectIntegration', connectHandler) },
  disconnectRouteOptions: { integration: new WebSocketLambdaIntegration('DisconnectIntegration',disconnectHandler) },
  defaultRouteOptions: { integration: new WebSocketLambdaIntegration('DefaultIntegration', defaultHandler) },
});

new apigwv2.WebSocketStage(this, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  description: 'My Stage',
  autoDeploy: true,
});
```

To retrieve a websocket URL and a callback URL:

```ts
declare const webSocketStage: apigwv2.WebSocketStage;

const webSocketURL = webSocketStage.url;
// wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}
const callbackURL = webSocketStage.callbackUrl;
// https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}
```

To add any other route:

```ts
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

declare const messageHandler: lambda.Function;
const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
webSocketApi.addRoute('sendmessage', {
  integration: new WebSocketLambdaIntegration('SendMessageIntegration', messageHandler),
});
```

To add a route that can return a result:

```ts
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

declare const messageHandler: lambda.Function;
const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
webSocketApi.addRoute('sendmessage', {
  integration: new WebSocketLambdaIntegration('SendMessageIntegration', messageHandler),
  returnResponse: true,
});
```

To import an existing WebSocketApi:

```ts
const webSocketApi = apigwv2.WebSocketApi.fromWebSocketApiAttributes(this, 'mywsapi', { webSocketId: 'api-1234' });
```

To generate an ARN for Execute API:

```ts
const api = new apigwv2.WebSocketApi(this, 'mywsapi');
const arn = api.arnForExecuteApiV2('$connect', 'dev');
```

For a detailed explanation of this function, including usage and examples, please refer to the [Generating ARN for Execute API](#generating-arn-for-execute-api) section under HTTP API.


### Manage Connections Permission

Grant permission to use API Gateway Management API of a WebSocket API by calling the `grantManageConnections` API.
You can use Management API to send a callback message to a connected client, get connection information, or disconnect the client. Learn more at [Use @connections commands in your backend service](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html).

```ts
declare const fn: lambda.Function;

const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
const stage = new apigwv2.WebSocketStage(this, 'mystage', {
  webSocketApi,
  stageName: 'dev',
});
// per stage permission
stage.grantManagementApiAccess(fn);
// for all the stages permission
webSocketApi.grantManageConnections(fn);
```

### Managing access to WebSocket APIs

API Gateway supports multiple mechanisms for [controlling and managing access to a WebSocket API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-control-access.html) through authorizers.

These authorizers can be found in the [APIGatewayV2-Authorizers](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2_authorizers-readme.html) constructs library.

### API Keys

Websocket APIs also support usage of API Keys. An API Key is a key that is used to grant access to an API. These are useful for controlling and tracking access to an API, when used together with [usage plans](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html). These together allow you to configure controls around API access such as quotas and throttling, along with per-API Key metrics on usage.

To require an API Key when accessing the Websocket API:

```ts
const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi',{
  apiKeySelectionExpression: apigwv2.WebSocketApiKeySelectionExpression.HEADER_X_API_KEY,
});
```

## Common Config
Common config for both HTTP API and WebSocket API

### Route Settings
Represents a collection of route settings.

```ts
declare const api: apigwv2.HttpApi;

new apigwv2.HttpStage(this, 'Stage', {
  httpApi: api,
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
});
```
