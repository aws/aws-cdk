# AWS::S3ObjectLambda Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

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
