## AWS Lambda Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This construct library allows you to define AWS Lambda Functions.

```ts
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');

const fn = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});
```

### Handler Code

The `lambda.Code` class includes static convenience methods for various types of
runtime code.

 * `lambda.Code.fromBucket(bucket, key[, objectVersion])` - specify an S3 object
   that contains the archive of your runtime code.
 * `lambda.Code.fromInline(code)` - inline the handle code as a string. This is
   limited to supported runtimes and the code cannot exceed 4KiB.
 * `lambda.Code.fromAsset(path)` - specify a directory or a .zip file in the local
   filesystem which will be zipped and uploaded to S3 before deployment.

The following example shows how to define a Python function and deploy the code
from the local directory `my-lambda-handler` to it:

[Example of Lambda Code from Local Assets](test/integ.assets.lit.ts)

When deploying a stack that contains this code, the directory will be zip
archived and then uploaded to an S3 bucket, then the exact location of the S3
objects will be passed when the stack is deployed.

During synthesis, the CDK expects to find a directory on disk at the asset
directory specified. Note that we are referencing the asset directory relatively
to our CDK project directory. This is especially important when we want to share
this construct through a library. Different programming languages will have
different techniques for bundling resources into libraries.

### Versions and Aliases

You can use
[versions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
to manage the deployment of your AWS Lambda functions. For example, you can
publish a new version of a function for beta testing without affecting users of
the stable production version.

The function version includes the following information:

- The function code and all associated dependencies.
- The Lambda runtime that executes the function.
- All of the function settings, including the environment variables.
- A unique Amazon Resource Name (ARN) to identify this version of the function.

You can define one or more
[aliases](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html)
for your AWS Lambda function. A Lambda alias is like a pointer to a specific
Lambda function version. Users can access the function version using the alias
ARN.

The `fn.currentVersion` property can be used to obtain a `lambda.Version`
resource that represents the AWS Lambda function defined in your application.
Any change to your function's code or configuration will result in the creation
of a new version resource. You can specify options for this version through the
`currentVersionOptions` property.

> The `currentVersion` property is only supported when your AWS Lambda function
> uses either `lambda.Code.fromAsset` or `lambda.Code.fromInline`. Other types
> of code providers (such as `lambda.Code.fromBucket`) require that you define a
> `lambda.Version` resource directly since the CDK is unable to determine if
> their contents had changed.

The `version.addAlias()` method can be used to define an AWS Lambda alias that
points to a specific version.

The following example defines an alias named `live` which will always point to a
version that represents the function as defined in your CDK app. When you change
your lambda code or configuration, a new resource will be created. You can
specify options for the current version through the `currentVersionOptions`
property.

```ts
const fn = new lambda.Function(this, 'MyFunction', {
  currentVersionOptions: {
    removalPolicy: RemovalPolicy.RETAIN, // retain old versions
    retryAttempts: 1                     // async retry attempts
  }
});

fn.currentVersion.addAlias('live');
```

> NOTE: The `fn.latestVersion` property returns a `lambda.IVersion` which
> represents the `$LATEST` pseudo-version. Most AWS services require a specific
> AWS Lambda version, and won't allow you to use `$LATEST`. Therefore, you would
> normally want to use `lambda.currentVersion`.

### Layers

The `lambda.LayerVersion` class can be used to define Lambda layers and manage
granting permissions to other AWS accounts or organizations.

[Example of Lambda Layer usage](test/integ.layer-version.lit.ts)

### Event Rule Target

You can use an AWS Lambda function as a target for an Amazon CloudWatch event
rule:

```ts
import targets = require('@aws-cdk/aws-events-targets');
rule.addTarget(new targets.LambdaFunction(myFunction));
```

### Event Sources

AWS Lambda supports a [variety of event sources](https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html).

In most cases, it is possible to trigger a function as a result of an event by
using one of the `add<Event>Notification` methods on the source construct. For
example, the `s3.Bucket` construct has an `onEvent` method which can be used to
trigger a Lambda when an event, such as PutObject occurs on an S3 bucket.

An alternative way to add event sources to a function is to use `function.addEventSource(source)`.
This method accepts an `IEventSource` object. The module __@aws-cdk/aws-lambda-event-sources__
includes classes for the various event sources supported by AWS Lambda.

For example, the following code adds an SQS queue as an event source for a function:

```ts
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
fn.addEventSource(new SqsEventSource(queue));
```

The following code adds an S3 bucket notification as an event source:

```ts
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
fn.addEventSource(new S3EventSource(bucket, {
  events: [ s3.EventType.OBJECT_CREATED, s3.EventType.OBJECT_DELETED ],
  filters: [ { prefix: 'subdir/' } ] // optional
}));
```

See the documentation for the __@aws-cdk/aws-lambda-event-sources__ module for more details.

### Lambda with DLQ

A dead-letter queue can be automatically created for a Lambda function by
setting the `deadLetterQueueEnabled: true` configuration.

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    deadLetterQueueEnabled: true
});
```

It is also possible to provide a dead-letter queue instead of getting a new queue created:

```ts
import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');

const dlq = new sqs.Queue(this, 'DLQ');
const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    deadLetterQueue: dlq
});
```

See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/dlq.html)
to learn more about AWS Lambdas and DLQs.

### Lambda with X-Ray Tracing

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    tracing: lambda.Tracing.ACTIVE
});
```

See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html)
to learn more about AWS Lambda's X-Ray support.

### Lambda with Reserved Concurrent Executions

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    reservedConcurrentExecutions: 100
});
```

See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html)
managing concurrency.

### Log Group

Lambda functions automatically create a log group with the name `/aws/lambda/<function-name>` upon first execution with
log data set to never expire.

The `logRetention` property can be used to set a different expiration period.

It is possible to obtain the function's log group as a `logs.ILogGroup` by calling the `logGroup` property of the
`Function` construct.

*Note* that, if either `logRetention` is set or `logGroup` property is called, a [CloudFormation custom
resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html) is added
to the stack that pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the
correct log retention period (never expire, by default).

*Further note* that, if the log group already exists and the `logRetention` is not set, the custom resource will reset
the log retention to never expire even if it was configured with a different value.

### Singleton Function

The `SingletonFunction` construct is a way to guarantee that a lambda function will be guaranteed to be part of the stack,
once and only once, irrespective of how many times the construct is declared to be part of the stack. This is guaranteed
as long as the `uuid` property and the optional `lambdaPurpose` property stay the same whenever they're declared into the
stack.

A typical use case of this function is when a higher level construct needs to declare a Lambda function as part of it but
needs to guarantee that the function is declared once. However, a user of this higher level construct can declare it any
number of times and with different properties. Using `SingletonFunction` here with a fixed `uuid` will guarantee this.

For example, the `LogRetention` construct requires only one single lambda function for all different log groups whose
retention it seeks to manage.

### Language-specific APIs
Language-specific higher level constructs are provided in separate modules:

* Node.js: [`@aws-cdk/aws-lambda-nodejs`](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda-nodejs)
