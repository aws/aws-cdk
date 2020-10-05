# RFC: AWS Lambda - Metadata about Code Assets

As described in [#1432](https://github.com/aws/aws-cdk/issues/1432), in order to support local debugging,
debuggers like [SAM CLI](https://github.com/awslabs/aws-sam-cli) need to be able to find the code of a Lambda
function locally.

The current implementation of assets uses CloudFormation Parameters which represent the S3 bucket and key of the
uploaded asset, which makes it impossible for local tools to reason about (without traversing the cx protocol with
many heuristics).

## Approach

We will automatically embed CloudFormation metadata on `AWS::Lambda::Function` (and any other) resources which use
local assets for code. The metadata will allow tools like SAM CLI to find the code locally for local invocations.

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

## Design

We will add a new method to the `Asset` class called `addResourceMetadata(resource, propName)`. This method will
take in an L1 resource (`cdk.Resource`) and a property name (`string`) and will add template metadata as
described above.

This feature will be enabled by a context key `aws:cdk:enable-asset-metadata`, which will be enabled by default in
the CDK Toolkit. The switch `--asset-metadata` (or `--no-asset-metadata`) can be used to control this behavior, as
well as through the key `assetMetadata` in `cdk.json`. Very similar design to how path metadata is controlled.

## Alternatives Considered

We considered alternatives that will "enforce" the embedding of metadata when an asset is referenced by a resource. Since
a single asset can be referenced by multiple resources, it means that the _relationship_ is what should trigger the
metadata addition. There currently isn't support in the framework for such hooks, but there is a possibility that
the changes in [#1436](https://github.com/aws/aws-cdk/pull/1436) might enable hooking into the relationship, and then we might be able to use this mechanism to produce the metadata.

Having said that, the need to embed asset metadata on resources is mainly confined to authors of L2 constructs, and not applicable for the general user population, so the value of automation is not high.

## What about L1 resources?

If users directly use L1 resources such as `lambda.CfnFunction` or `serverless.CfnFunction` and wish to use local CDK assets with tooling, they will have to explicitly add metadata:

```ts
const asset = new assets.ZipDirectoryAsset(this, 'Foo', {
  path: '/foo/boom'
});

const resource = new serverless.CfnFunction(this, 'Func', {
    codeUri: {
    bucket: asset.s3BucketName,
    key: asset.s3ObjectKey
  },
  runtime: 'nodejs8.10',
  handler: 'index.handler'
});

resource.addResourceMetadata(resource, 'CodeUri');
```
