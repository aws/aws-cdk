## AWS Lambda Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


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

### Layers

The `lambda.LayerVersion` class can be used to define Lambda layers and manage
granting permissions to other AWS accounts or organizations.

[Example of Lambda Layer usage](test/integ.layer-version.lit.ts)

## Event Rule Target

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
    runtime: lambda.Runtime.NODEJS_8_10,
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
    runtime: lambda.Runtime.NODEJS_8_10,
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
    runtime: lambda.Runtime.NODEJS_8_10,
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
    runtime: lambda.Runtime.NODEJS_8_10,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    reservedConcurrentExecutions: 100
});
```
See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html)
managing concurrency.
