# AWS::S3ObjectLambda Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This construct library allows you to define S3 object lambda access points.

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3objectlambda from '@aws-cdk/aws-s3objectlambda';
import * as cdk from '@aws-cdk/core';

const stack = new cdk.Stack();
const bucket = new s3.Bucket(stack, 'MyBucket');
const handler = new lambda.Function(stack, 'MyFunction', {
	runtime: lambda.Runtime.NODEJS_14_X,
	handler: 'index.handler',
	code: lambda.Code.fromAsset('lambda.zip'),
});
new s3objectlambda.AccessPoint(stack, 'MyObjectLambda', {
	bucket,
	handler,
	accessPointName: 'my-access-point',
	payload: {
		prop: "value",
	},
});
```

## Handling range and part number requests

Lambdas are currently limited to only transforming `GetObject` requests. However, they can additionally support `GetObject-Range` and `GetObject-PartNumber` requests, which needs to be specified in the access point configuration:

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3objectlambda from '@aws-cdk/aws-s3objectlambda';
import * as cdk from '@aws-cdk/core';

const stack = new cdk.Stack();
const bucket = new s3.Bucket(stack, 'MyBucket');
const handler = new lambda.Function(stack, 'MyFunction', {
	runtime: lambda.Runtime.NODEJS_14_X,
	handler: 'index.handler',
	code: lambda.Code.fromAsset('lambda.zip'),
});
new s3objectlambda.AccessPoint(stack, 'MyObjectLambda', {
	bucket,
	handler,
	accessPointName: 'my-access-point',
	supportsGetObjectRange: true,
	supportsGetObjectPartNumber: true,
});
```

## Pass additional data to Lambda function

You can specify an additional object that provides supplemental data to the Lambda function used to transform objects. The data is delivered as a JSON payload to the Lambda:

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3objectlambda from '@aws-cdk/aws-s3objectlambda';
import * as cdk from '@aws-cdk/core';

const stack = new cdk.Stack();
const bucket = new s3.Bucket(stack, 'MyBucket');
const handler = new lambda.Function(stack, 'MyFunction', {
	runtime: lambda.Runtime.NODEJS_14_X,
	handler: 'index.handler',
	code: lambda.Code.fromAsset('lambda.zip'),
});
new s3objectlambda.AccessPoint(stack, 'MyObjectLambda', {
	bucket,
	handler,
	accessPointName: 'my-access-point',
	payload: {
		prop: "value",
	},
});
```
