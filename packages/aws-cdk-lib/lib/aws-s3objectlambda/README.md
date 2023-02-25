# AWS::S3ObjectLambda Construct Library


This construct library allows you to define S3 object lambda access points.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3objectlambda from 'aws-cdk-lib/aws-s3objectlambda';
import * as cdk from 'aws-cdk-lib';

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
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3objectlambda from 'aws-cdk-lib/aws-s3objectlambda';
import * as cdk from 'aws-cdk-lib';

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
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3objectlambda from 'aws-cdk-lib/aws-s3objectlambda';
import * as cdk from 'aws-cdk-lib';

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
