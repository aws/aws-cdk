## AWS Lambda Construct Library

This construct library allows you to define AWS Lambda functions.

```ts
const fn = new Lambda(this, 'MyFunction', {
    runtime: LambdaRuntime.NodeJS810,
    handler: 'index.handler'
    code: LambdaCode.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
});
```

### Handler Code

The `LambdaCode` class includes static convenience methods for various types of
runtime code.

 * `LambdaCode.bucket(bucket, key[, objectVersion])` - specify an S3 object that
   contains the archive of your runtime code.
 * `LambdaCode.inline(code)` - inline the handle code as a string. This is
   limited to 4KB. The class `InlineJavaScriptLambda` can be used to simplify
   inlining JavaScript functions.
 * `LambdaCode.directory(directory)` - specify a directory in the local filesystem
   which will be zipped and uploaded to S3 before deployment.
 * `LambdaCode.file(path)` - specify a file to be used for Lambda code. This can
   be, for example a JAR or a ZIP file, based on the runtime used.

The following example shows how to define a Python function and deploy the code from the
local directory `my-lambda-handler` to it:

[Example of Lambda Code from Local Assets](test/integ.assets.lit.ts)

When deploying a stack that contains this code, the directory will be zip
archived and then uploaded to an S3 bucket, then the exact location of the S3
objects will be passed when the stack is deployed.
