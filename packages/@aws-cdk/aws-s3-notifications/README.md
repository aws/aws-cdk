# S3 Bucket Notifications Destinations
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

This module includes integration classes for using Topics, Queues or Lambdas
as S3 Notification Destinations.

## Examples

The following example shows how to send a notification to an SNS
topic when an object is created in an S3 bucket:

```ts
import * as sns from '@aws-cdk/aws-sns';

const bucket = new s3.Bucket(this, 'Bucket');
const topic = new sns.Topic(this, 'Topic');

bucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));
```

The following example shows how to send a notification to an SQS queue
when an object is created in an S3 bucket:

```ts
import * as sqs from '@aws-cdk/aws-sqs';

const bucket = new s3.Bucket(this, 'Bucket');
const queue = new sqs.Queue(this, 'Queue');

bucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SqsDestination(queue));
```

The following example shows how to send a notification to a Lambda function when an object is created in an S3 bucket:

```ts
import * as lambda from '@aws-cdk/aws-lambda';

const bucket = new s3.Bucket(this, 'Bucket');
const fn = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});

bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(fn));
```
