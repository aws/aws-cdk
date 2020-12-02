# S3 Bucket Notifications Destinations
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module includes integration classes for using Topics, Queues or Lambdas
as S3 Notification Destinations.

## Example

The following example shows how to send a notification to an SNS
topic when an object is created in an S3 bucket:

```ts
import * as s3n from '@aws-cdk/aws-s3-notifications';

const bucket = new s3.Bucket(stack, 'Bucket');
const topic = new sns.Topic(stack, 'Topic');

bucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));
```
