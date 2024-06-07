# AWS APIGatewayv2 Integrations

## Table of Contents

- [HTTP APIs](#http-apis)
  - [Lambda Integration](#lambda)
  - [HTTP Proxy Integration](#http-proxy)
  - [StepFunctions Integration](#stepfunctions-integration)
  - [Private Integration](#private-integration)
  - [Request Parameters](#request-parameters)
- [WebSocket APIs](#websocket-apis)
  - [Lambda WebSocket Integration](#lambda-websocket-integration)
  - [AWS WebSocket Integration](#aws-websocket-integration)
- [Import Issues](#import-issues)
  - [DotNet Namespace](#dotnet-namespace)
  - [Java Package](#java-package)

## HTTP APIs

Integrations connect a route to backend resources. HTTP APIs support Lambda proxy, AWS service, and HTTP proxy integrations. HTTP proxy integrations are also known as private integrations.

### Lambda

Lambda integrations enable integrating an HTTP API route with a Lambda function. When a client invokes the route, the
API Gateway service forwards the request to the Lambda function and returns the function's response to the client.

The API Gateway service will invoke the Lambda function with an event payload of a specific format. The service expects
the function to respond in a specific format. The details on this format are available at [Working with AWS Lambda
proxy integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html).

The following code configures a route `GET /books` with a Lambda proxy integration.

```ts
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const booksIntegration = new HttpUrlIntegration('BooksIntegration', 'https://get-books-proxy.example.com');

const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

httpApi.addRoutes({
  path: '/books',
  methods: [ apigwv2.HttpMethod.GET ],
  integration: booksIntegration,
});
```

### StepFunctions Integration

Step Functions integrations enable integrating an HTTP API route with AWS Step Functions.
This allows the HTTP API to start state machine executions synchronously or asynchronously, or to stop executions.

When a client invokes the route configured with a Step Functions integration, the API Gateway service interacts with the specified state machine according to the integration subtype (e.g., starts a new execution, synchronously starts an execution, or stops an execution) and returns the response to the client.

The following code configures a Step Functions integrations:

```ts
import { HttpStepFunctionsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

declare const stateMachine: sfn.StateMachine;
declare const httpApi: apigwv2.HttpApi;

httpApi.addRoutes({
  path: '/start',
  methods: [ apigwv2.HttpMethod.POST ],
  integration: new HttpStepFunctionsIntegration('StartExecutionIntegration', {
    stateMachine,
    subtype: apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
  }),
});

httpApi.addRoutes({
  path: '/start-sync',
  methods: [ apigwv2.HttpMethod.POST ],
  integration: new HttpStepFunctionsIntegration('StartSyncExecutionIntegration', {
    stateMachine,
    subtype: apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_START_SYNC_EXECUTION,
  }),
});

httpApi.addRoutes({
  path: '/stop',
  methods: [ apigwv2.HttpMethod.POST ],
  integration: new HttpStepFunctionsIntegration('StopExecutionIntegration', {
    stateMachine,
    subtype: apigwv2.HttpIntegrationSubtype.STEPFUNCTIONS_STOP_EXECUTION,
    // For the `STOP_EXECUTION` subtype, it is necessary to specify the `executionArn`.
    parameterMapping: new apigwv2.ParameterMapping()
      .custom('ExecutionArn', '$request.querystring.executionArn'),
  }),
});
```

**Note**:

- The `executionArn` parameter is required for the `STOP_EXECUTION` subtype. It is necessary to specify the `executionArn` in the `parameterMapping` property of the `HttpStepFunctionsIntegration` object.
- `START_SYNC_EXECUTION` subtype is only supported for EXPRESS type state machine.

### Private Integration

Private integrations enable integrating an HTTP API route with private resources in a VPC, such as Application Load Balancers or
Amazon ECS container-based applications.  Using private integrations, resources in a VPC can be exposed for access by
clients outside of the VPC.

The following integrations are supported for private resources in a VPC.

#### Application Load Balancer

The following code is a basic application load balancer private integration of HTTP API:

```ts
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
import { HttpNlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';
import { HttpServiceDiscoveryIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

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
or sends a message specific to a route, the API Gateway service forwards the request to the Lambda function

The API Gateway service will invoke the Lambda function with an event payload of a specific format.

The following code configures a `sendMessage` route with a Lambda integration

```ts
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
new apigwv2.WebSocketStage(this, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

declare const messageHandler: lambda.Function;
webSocketApi.addRoute('sendMessage', {
  integration: new WebSocketLambdaIntegration('SendMessageIntegration', messageHandler),
});
```

### AWS WebSocket Integration

AWS type integrations enable integrating with any supported AWS service. This is only supported for WebSocket APIs. When a client 
connects/disconnects or sends a message specific to a route, the API Gateway service forwards the request to the specified AWS service.

The following code configures a `$connect` route with a AWS integration that integrates with a dynamodb table. On websocket api connect,
it will write new entry to the dynamodb table. 

```ts
import { WebSocketAwsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

const webSocketApi = new apigwv2.WebSocketApi(this, 'mywsapi');
new apigwv2.WebSocketStage(this, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

declare const apiRole: iam.Role;
declare const table: dynamodb.Table;
webSocketApi.addRoute('$connect', {
  integration: new WebSocketAwsIntegration('DynamodbPutItem', {
    integrationUri: `arn:aws:apigateway:${this.region}:dynamodb:action/PutItem`,
    integrationMethod: apigwv2.HttpMethod.POST,
    credentialsRole: apiRole,
    requestTemplates: {
      'application/json': JSON.stringify({
        TableName: table.tableName,
        Item: {
          id: {
            S: '$context.requestId',
          },
        },
      }),
    },
  }),
});
```

You can also set additional properties to change the behavior of your integration, such as `contentHandling`.
See [Working with binary media types for WebSocket APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-binary-media-types.html).

## Import Issues

`jsiirc.json` file is missing during the stablization process of this module, which caused import issues for DotNet and Java users who attempt to use this module. Unfortunately, to guarantee backward compatibility, we cannot simply correct the namespace for DotNet or package for Java. The following outlines the workaround.

### DotNet Namespace

Instead of the conventional namespace `Amazon.CDK.AWS.Apigatewayv2.Integrations`, you would need to use the following namespace:

```cs
using Amazon.CDK.AwsApigatewayv2Integrations;
```

### Java Package

Instead of conventional package `import software.amazon.awscdk.services.apigatewayv2_integrations.*`, you would need to use the following package:

```java
import software.amazon.awscdk.aws_apigatewayv2_integrations.*;

// If you want to import a specific construct
import software.amazon.awscdk.aws_apigatewayv2_integrations.WebSocketAwsIntegration;
```
