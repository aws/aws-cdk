## AWS Lambda Construct Library

This construct library allows you to define AWS Lambda Functions.

```ts
import lambda = require('@aws-cdk/aws-lambda');

const fn = new lambda.Function(this, 'MyFunction', {
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
});
```

### Handler Code

The `lambda.Code` class includes static convenience methods for various types of
runtime code.

 * `lambda.Code.bucket(bucket, key[, objectVersion])` - specify an S3 object that
   contains the archive of your runtime code.
 * `lambda.Code.inline(code)` - inline the handle code as a string. This is
   limited to 4KB. The class `InlineJavaScriptLambda` can be used to simplify
   inlining JavaScript functions.
 * `lambda.Code.directory(directory)` - specify a directory in the local filesystem
   which will be zipped and uploaded to S3 before deployment.
 * `lambda.Code.file(path)` - specify a file to be used for Lambda code. This can
   be, for example a JAR or a ZIP file, based on the runtime used.

The following example shows how to define a Python function and deploy the code from the
local directory `my-lambda-handler` to it:

[Example of Lambda Code from Local Assets](test/integ.assets.lit.ts)

When deploying a stack that contains this code, the directory will be zip
archived and then uploaded to an S3 bucket, then the exact location of the S3
objects will be passed when the stack is deployed.

### Lambda in CodePipeline

This module also contains an Action that allows you to invoke a Lambda function from CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');

const lambdaFun = new lambda.Function(this, 'MyLambda', {
    // some lambda parameters here...
});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const lambdaStage = new codepipeline.Stage(this, 'Lambda', {
    pipeline,
});
new lambda.PipelineInvokeAction(this, 'Lambda', {
    stage: lambdaStage,
    lambda: lambdaFun,
});
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
