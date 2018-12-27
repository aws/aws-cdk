# RFC: AWS Lambda - Metadata about Code Assets

As described in [#1432](https://github.com/awslabs/aws-cdk/issues/1432), in order to support local debugging,
debuggers like [SAM CLI](https://github.com/awslabs/aws-sam-cli) need to be able to find the code of a Lambda
function locally.

The current implementation of assets uses CloudFormation Parameters which represent the S3 bucket and key of the
uploaded asset, which makes it impossible for local tools to reason about (without traversing the cx protocol with
many heuristics).

## Approach

We will automatically embed CloudFormation metadata on `AWS::Lambda::Function` resources which use
local assets for code. The metadata will allow tools like SAM CLI to find the code locally for local invocations.

## Design

Given a CDK app with an AWS Lambda function defined like so:

```ts
new lambda.Function(this, 'MyHandler', {
  // ...
  code: lambda.Code.asset('/path/to/handler')
});
```

The synthesized `AWS::Lambda::Function` resource will include a "Metadata" entry as follows:

```js
{
  "Type": "AWS::Lambda::Function",
  "Properties": {
    "Code": {
      // current asset magic
    }
  },
  "Metadata": {
    "aws:asset:property": "Code",
    "aws:asset:path": "/path/to/handler"
  }
}
```

Local debugging tools like SAM CLI will be able to traverse the template and look up the `aws:asset` metadata
entries, and use them to process the template so it will be compatible with their inputs.

