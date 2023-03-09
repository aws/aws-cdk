# S3 Bucket Notifications Destinations
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

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
