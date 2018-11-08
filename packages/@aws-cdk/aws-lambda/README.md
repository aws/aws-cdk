## AWS Lambda Construct Library

This construct library allows you to define AWS Lambda Functions.

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.asset('./lambda-handler'),
});
```

### Handler Code

The `lambda.Code` class includes static convenience methods for various types of
runtime code.

 * `lambda.Code.bucket(bucket, key[, objectVersion])` - specify an S3 object
   that contains the archive of your runtime code.
 * `lambda.Code.inline(code)` - inline the handle code as a string. This is
   limited to 4KB.
 * `lambda.Code.asset(path)` - specify a directory or a .zip file in the local
   filesystem which will be zipped and uploaded to S3 before deployment.

The following example shows how to define a Python function and deploy the code
from the local directory `my-lambda-handler` to it:

[Example of Lambda Code from Local Assets](test/integ.assets.lit.ts)

When deploying a stack that contains this code, the directory will be zip
archived and then uploaded to an S3 bucket, then the exact location of the S3
objects will be passed when the stack is deployed.

### Event Sources

AWS Lambda supports a [variety of event sources](https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html).

In most cases, it is possible to trigger a function as a result of an event by 
using one of the `onXxx` methods on the source construct. For example, the `s3.Bucket` 
construct has an `onEvent` method which can be used to trigger a Lambda when an event, 
such as PutObject occurs on an S3 bucket.

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
  events: [ s3.EventType.ObjectCreated, s3.EventType.ObjectDeleted ],
  filters: [ { prefix: 'subdir/' } ] // optional
}));
```

See the documentation for the __@aws-cdk/aws-lambda-event-sources__ module for more details.

### Lambda in CodePipeline

This module also contains an Action that allows you to invoke a Lambda function from CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const lambdaStage = pipeline.addStage('Lambda');
new lambda.PipelineInvokeAction(this, 'Lambda', {
    stage: lambdaStage,
    lambda: fn,
});
```

You can also add the Lambda to the Pipeline directly:

```ts
// equivalent to the code above:
fn.addToPipeline(lambdaStage, 'Lambda');
```

See [the AWS documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
on how to write a Lambda function invoked from CodePipeline.

### Lambda with DLQ 

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    deadLetterQueueEnabled: true
});
```
See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/dlq.html)
to learn more about AWS Lambdas and DLQs.

### Lambda with X-Ray Tracing 

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    tracing: lambda.Tracing.Active
});
```
See [the AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html)
to learn more about AWS Lambda's X-Ray support.
