## Amazon API Gateway Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

Amazon API Gateway is a fully managed service that makes it easy for developers
to publish, maintain, monitor, and secure APIs at any scale. Create an API to
access data, business logic, or functionality from your back-end services, such
as applications running on Amazon Elastic Compute Cloud (Amazon EC2), code
running on AWS Lambda, or any web application.

### Defining APIs

APIs are defined as a hierarchy of resources and methods. `addResource` and
`addMethod` can be used to build this hierarchy. The root resource is
`api.root`.

For example, the following code defines an API that includes the following HTTP
endpoints: `ANY /, GET /books`, `POST /books`, `GET /books/{book_id}`, `DELETE /books/{book_id}`.

```ts
const api = new apigateway.RestApi(this, 'books-api');

api.root.addMethod('ANY');

const books = api.root.addResource('books');
books.addMethod('GET');
books.addMethod('POST');

const book = books.addResource('{book_id}');
book.addMethod('GET');
book.addMethod('DELETE');
```

### AWS Lambda-backed APIs

A very common practice is to use Amazon API Gateway with AWS Lambda as the
backend integration. The `LambdaRestApi` construct makes it easy:

The following code defines a REST API that routes all requests to the
specified AWS Lambda function:

```ts
const backend = new lambda.Function(...);
new apigateway.LambdaRestApi(this, 'myapi', {
  handler: backend,
});
```

You can also supply `proxy: false`, in which case you will have to explicitly
define the API model:

```ts
const backend = new lambda.Function(...);
const api = new apigateway.LambdaRestApi(this, 'myapi', {
  handler: backend,
  proxy: false
});

const items = api.root.addResource('items');
items.addMethod('GET');  // GET /items
items.addMethod('POST'); // POST /items

const item = items.addResource('{item}');
item.addMethod('GET');   // GET /items/{item}

// the default integration for methods is "handler", but one can
// customize this behavior per method or even a sub path.
item.addMethod('DELETE', new apigateway.HttpIntegration('http://amazon.com'));
```

### Integration Targets

Methods are associated with backend integrations, which are invoked when this
method is called. API Gateway supports the following integrations:

 * `MockIntegration` - can be used to test APIs. This is the default
   integration if one is not specified.
 * `LambdaIntegration` - can be used to invoke an AWS Lambda function.
 * `AwsIntegration` - can be used to invoke arbitrary AWS service APIs.
 * `HttpIntegration` - can be used to invoke HTTP endpoints.

The following example shows how to integrate the `GET /book/{book_id}` method to
an AWS Lambda function:

```ts
const getBookHandler = new lambda.Function(...);
const getBookIntegration = new apigateway.LambdaIntegration(getBookHandler);
book.addMethod('GET', getBookIntegration);
```

Integration options can be optionally be specified:

```ts
const getBookIntegration = new apigateway.LambdaIntegration(getBookHandler, {
  contentHandling: apigateway.ContentHandling.CONVERT_TO_TEXT, // convert to base64
  credentialsPassthrough: true, // use caller identity to invoke the function
});
```

Method options can optionally be specified when adding methods:

```ts
book.addMethod('GET', getBookIntegration, {
  authorizationType: apigateway.AuthorizationType.IAM,
  apiKeyRequired: true
});
```

The following example shows how to use an API Key with a usage plan:

```ts
const hello = new lambda.Function(this, 'hello', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'hello.handler',
  code: lambda.Code.fromAsset('lambda')
});

const api = new apigateway.RestApi(this, 'hello-api', { });
const integration = new apigateway.LambdaIntegration(hello);

const v1 = api.root.addResource('v1');
const echo = v1.addResource('echo');
const echoMethod = echo.addMethod('GET', integration, { apiKeyRequired: true });
const key = api.addApiKey('ApiKey');

const plan = api.addUsagePlan('UsagePlan', {
  name: 'Easy',
  apiKey: key
});

plan.addApiStage({
  stage: api.deploymentStage,
  throttle: [
    {
      method: echoMethod,
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    }
  ]
});
```

### Working with models

When you work with Lambda integrations that are not Proxy integrations, you
have to define your models and mappings for the request, response, and integration.

```ts
const hello = new lambda.Function(this, 'hello', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'hello.handler',
  code: lambda.Code.fromAsset('lambda')
});

const api = new apigateway.RestApi(this, 'hello-api', { });
const resource = api.root.addResource('v1');
```

You can define more parameters on the integration to tune the behavior of API Gateway

```ts
const integration = new LambdaIntegration(hello, {
  proxy: false,
  requestParameters: {
    // You can define mapping parameters from your method to your integration
    // - Destination parameters (the key) are the integration parameters (used in mappings)
    // - Source parameters (the value) are the source request parameters or expressions
    // @see: https://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html
    'integration.request.querystring.who': 'method.request.querystring.who'
  },
  allowTestInvoke: true,
  requestTemplates: {
    // You can define a mapping that will build a payload for your integration, based
    //  on the integration parameters that you have specified
    // Check: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
    'application/json': JSON.stringify({ action: 'sayHello', pollId: "$util.escapeJavaScript($input.params('who'))" })
  },
  // This parameter defines the behavior of the engine is no suitable response template is found
  passthroughBehavior: PassthroughBehavior.NEVER,
  integrationResponses: [
    {
      // Successful response from the Lambda function, no filter defined
      //  - the selectionPattern filter only tests the error message
      // We will set the response status code to 200
      statusCode: "200",
      responseTemplates: {
        // This template takes the "message" result from the Lambda function, adn embeds it in a JSON response
        // Check https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
        'application/json': JSON.stringify({ state: 'ok', greeting: '$util.escapeJavaScript($input.body)' })
      },
      responseParameters: {
        // We can map response parameters
        // - Destination parameters (the key) are the response parameters (used in mappings)
        // - Source parameters (the value) are the integration response parameters or expressions
        'method.response.header.Content-Type': "'application/json'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'true'"
      }
    },
    {
      // For errors, we check if the error message is not empty, get the error data
      selectionPattern: '(\n|.)+',
      // We will set the response status code to 200
      statusCode: "400",
      responseTemplates: {
          'application/json': JSON.stringify({ state: 'error', message: "$util.escapeJavaScript($input.path('$.errorMessage'))" })
      },
      responseParameters: {
          'method.response.header.Content-Type': "'application/json'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Credentials': "'true'"
      }
    }
  ]
});

```

You can define models for your responses (and requests)

```ts
// We define the JSON Schema for the transformed valid response
const responseModel = api.addModel('ResponseModel', {
  contentType: 'application/json',
  modelName: 'ResponseModel',
  schema: { '$schema': 'http://json-schema.org/draft-04/schema#', 'title': 'pollResponse', 'type': 'object', 'properties': { 'state': { 'type': 'string' }, 'greeting': { 'type': 'string' } } }
});

// We define the JSON Schema for the transformed error response
const errorResponseModel = api.addModel('ErrorResponseModel', {
  contentType: 'application/json',
  modelName: 'ErrorResponseModel',
  schema: { '$schema': 'http://json-schema.org/draft-04/schema#', 'title': 'errorResponse', 'type': 'object', 'properties': { 'state': { 'type': 'string' }, 'message': { 'type': 'string' } } }
});

```

And reference all on your method definition.

```ts
// If you want to define parameter mappings for the request, you need a validator
const validator = api.addRequestValidator('DefaultValidator', {
  validateRequestBody: false,
  validateRequestParameters: true
});
resource.addMethod('GET', integration, {
  // We can mark the parameters as required
  requestParameters: {
    'method.request.querystring.who': true
  },
  // We need to set the validator for ensuring they are passed
  requestValidator: validator,
  methodResponses: [
    {
      // Successful response from the integration
      statusCode: '200',
      // Define what parameters are allowed or not
      responseParameters: {
        'method.response.header.Content-Type': true,
        'method.response.header.Access-Control-Allow-Origin': true,
        'method.response.header.Access-Control-Allow-Credentials': true
      },
      // Validate the schema on the response
      responseModels: {
        'application/json': responseModel
      }
    },
    {
      // Same thing for the error responses
      statusCode: '400',
      responseParameters: {
        'method.response.header.Content-Type': true,
        'method.response.header.Access-Control-Allow-Origin': true,
        'method.response.header.Access-Control-Allow-Credentials': true
      },
      responseModels: {
        'application/json': errorResponseModel
      }
    }
  ]
});
```

#### Default Integration and Method Options

The `defaultIntegration` and `defaultMethodOptions` properties can be used to
configure a default integration at any resource level. These options will be
used when defining method under this resource (recursively) with undefined
integration or options.

> If not defined, the default integration is `MockIntegration`. See reference
documentation for default method options.

The following example defines the `booksBackend` integration as a default
integration. This means that all API methods that do not explicitly define an
integration will be routed to this AWS Lambda function.

```ts
const booksBackend = new apigateway.LambdaIntegration(...);
const api = new apigateway.RestApi(this, 'books', {
  defaultIntegration: booksBackend
});

const books = new api.root.addResource('books');
books.addMethod('GET');  // integrated with `booksBackend`
books.addMethod('POST'); // integrated with `booksBackend`

const book = books.addResource('{book_id}');
book.addMethod('GET');   // integrated with `booksBackend`
```

### Proxy Routes

The `addProxy` method can be used to install a greedy `{proxy+}` resource
on a path. By default, this also installs an `"ANY"` method:

```ts
const proxy = resource.addProxy({
  defaultIntegration: new LambdaIntegration(handler),

  // "false" will require explicitly adding methods on the `proxy` resource
  anyMethod: true // "true" is the default
});
```

### Deployments

By default, the `RestApi` construct will automatically create an API Gateway
[Deployment] and a "prod" [Stage] which represent the API configuration you
defined in your CDK app. This means that when you deploy your app, your API will
be have open access from the internet via the stage URL.

The URL of your API can be obtained from the attribute `restApi.url`, and is
also exported as an `Output` from your stack, so it's printed when you `cdk
deploy` your app:

```
$ cdk deploy
...
books.booksapiEndpointE230E8D5 = https://6lyktd4lpk.execute-api.us-east-1.amazonaws.com/prod/
```

To disable this behavior, you can set `{ deploy: false }` when creating your
API. This means that the API will not be deployed and a stage will not be
created for it. You will need to manually define a `apigateway.Deployment` and
`apigateway.Stage` resources.

Use the `deployOptions` property to customize the deployment options of your
API.

The following example will configure API Gateway to emit logs and data traces to
AWS CloudWatch for all API calls:

> By default, an IAM role will be created and associated with API Gateway to
allow it to write logs and metrics to AWS CloudWatch unless `cloudWatchRole` is
set to `false`.

```ts
const api = new apigateway.RestApi(this, 'books', {
  deployOptions: {
    loggingLevel: apigateway.MethodLoggingLevel.INFO,
    dataTraceEnabled: true
  }
})
```

#### Deeper dive: invalidation of deployments

API Gateway deployments are an immutable snapshot of the API. This means that we
want to automatically create a new deployment resource every time the API model
defined in our CDK app changes.

In order to achieve that, the AWS CloudFormation logical ID of the
`AWS::ApiGateway::Deployment` resource is dynamically calculated by hashing the
API configuration (resources, methods). This means that when the configuration
changes (i.e. a resource or method are added, configuration is changed), a new
logical ID will be assigned to the deployment resource. This will cause
CloudFormation to create a new deployment resource.

By default, old deployments are _deleted_. You can set `retainDeployments: true`
to allow users revert the stage to an old deployment manually.

[Deployment]: https://docs.aws.amazon.com/apigateway/api-reference/resource/deployment/
[Stage]: https://docs.aws.amazon.com/apigateway/api-reference/resource/stage/

### Custom Domains

To associate an API with a custom domain, use the `domainName` configuration when
you define your API:

```ts
const api = new apigw.RestApi(this, 'MyDomain', {
  domainName: {
    domainName: 'example.com',
    certificate: acmCertificateForExampleCom,
  },
});
```

This will define a `DomainName` resource for you, along with a `BasePathMapping`
from the root of the domain to the deployment stage of the API. This is a common
set up.

To route domain traffic to an API Gateway API, use Amazon Route 53 to create an
alias record. An alias record is a Route 53 extension to DNS. It's similar to a
CNAME record, but you can create an alias record both for the root domain, such
as `example.com`, and for subdomains, such as `www.example.com`. (You can create
CNAME records only for subdomains.)

```ts
new route53.ARecord(this, 'CustomDomainAliasRecord', {
  zone: hostedZoneForExampleCom,
  target: route53.AddressRecordTarget.fromAlias(new route53_targets.ApiGateway(api))
});
```

You can also define a `DomainName` resource directly in order to customize the default behavior:

```ts
new apigw.DomainName(this, 'custom-domain', {
  domainName: 'example.com',
  certificate: acmCertificateForExampleCom,
  endpointType: apigw.EndpointType.EDGE // default is REGIONAL
});
```

Once you have a domain, you can map base paths of the domain to APIs.
The following example will map the URL https://example.com/go-to-api1
to the `api1` API and https://example.com/boom to the `api2` API.

```ts
domain.addBasePathMapping(api1, { basePath: 'go-to-api1' });
domain.addBasePathMapping(api2, { basePath: 'boom' });
```

NOTE: currently, the mapping will always be assigned to the APIs
`deploymentStage`, which will automatically assigned to the latest API
deployment. Raise a GitHub issue if you require more granular control over
mapping base paths to stages.

If you don't specify `basePath`, all URLs under this domain will be mapped
to the API, and you won't be able to map another API to the same domain:

```ts
domain.addBasePathMapping(api);
```

This can also be achieved through the `mapping` configuration when defining the
domain as demonstrated above.

If you wish to setup this domain with an Amazon Route53 alias, use the `route53_targets.ApiGatewayDomain`:

```ts
new route53.ARecord(this, 'CustomDomainAliasRecord', {
  zone: hostedZoneForExampleCom,
  target: route53.AddressRecordTarget.fromAlias(new route53_targets.ApiGatewayDomain(domainName))
});
```

### Cross Origin Resource Sharing (CORS)

[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a mechanism
that uses additional HTTP headers to tell browsers to give a web application
running at one origin, access to selected resources from a different origin. A
web application executes a cross-origin HTTP request when it requests a resource
that has a different origin (domain, protocol, or port) from its own.

You can add the CORS [preflight](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests) OPTIONS HTTP method to any API resource via the `defaultCorsPreflightOptions` option or by calling the `addCorsPreflight` on a specific resource.

The following example will enable CORS for all methods and all origins on all resources of the API:

```ts
new apigateway.RestApi(this, 'api', {
  defaultCorsPreflightOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
  }
})
```

The following example will add an OPTIONS method to the `myResource` API resource, which
only allows GET and PUT HTTP requests from the origin https://amazon.com.

```ts
myResource.addCorsPreflight({
  allowOrigins: [ 'https://amazon.com' ],
  allowMethods: [ 'GET', 'PUT' ]
});
```

See the
[`CorsOptions`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.CorsOptions.html)
API reference for a detailed list of supported configuration options.

You can specify defaults this at the resource level, in which case they will be applied to the entire resource sub-tree:

```ts
const subtree = resource.addResource('subtree', {
  defaultCorsPreflightOptions: {
    allowOrigins: [ 'https://amazon.com' ]
  }
});
```

This means that all resources under `subtree` (inclusive) will have a preflight
OPTIONS added to them.

See [#906](https://github.com/aws/aws-cdk/issues/906) for a list of CORS
features which are not yet supported.

----

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
