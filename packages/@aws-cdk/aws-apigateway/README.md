## CDK Construct Library for Amazon API Gateway

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
  contentHandling: apigateway.ContentHandling.ConvertToText, // convert to base64
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
also exported as an `CfnOutput` from your stack, so it's printed when you `cdk
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
    loggingLevel: apigateway.MethodLoggingLevel.Info,
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

### Missing Features

See [awslabs/aws-cdk#723](https://github.com/awslabs/aws-cdk/issues/723) for a
list of missing features.

### Roadmap

- [ ] Support defining REST API Models [#1695](https://github.com/awslabs/aws-cdk/issues/1695)

----

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.
