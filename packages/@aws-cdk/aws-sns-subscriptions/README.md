# CDK Construct Library for Amazon Simple Notification Service Subscriptions
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This library provides constructs for adding subscriptions to an Amazon SNS topic.
Subscriptions can be added by calling the `.addSubscription(...)` method on the topic.

## Subscriptions

Subscriptions can be added to the following endpoints:

* HTTPS
* Amazon SQS
* AWS Lambda
* Email

Create an Amazon SNS Topic to add subscriptions.

```ts
import sns = require('@aws-cdk/aws-sns');

const myTopic = new sns.Topic(this, 'MyTopic');
```

### HTTPS

Add an HTTPS Subscription to your topic:

```ts
import subscriptions = require('@aws-cdk/aws-sns-subscriptions');

myTopic.addSubscription(new subscriptions.UrlSubscription('https://foobar.com/'));
```

### Amazon SQS

Subscribe a queue to your topic:

```ts
import sqs = require('@aws-cdk/aws-sqs');
import subscriptions = require('@aws-cdk/aws-sns-subscriptions');

const myQueue = new sqs.Queue(this, 'MyQueue');

myTopic.addSubscription(new subscriptions.SqsSubscription(queue));
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### AWS Lambda

Subscribe an AWS Lambda function to your topic:

```ts
import lambda = require('@aws-cdk/aws-lambda');
import subscriptions = require('@aws-cdk/aws-sns-subscriptions');

const myFunction = new lambda.Function(this, 'Echo', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`)
});

myTopic.addSubscription(new subscriptions.LambdaSubscription(myFunction));
```

### Email

Subscribe an email address to your topic:

```ts
import subscriptions = require('@aws-cdk/aws-sns-subscriptions');

myTopic.addSubscription(new subscriptions.EmailSubscription('foo@bar.com'));
```

Note that email subscriptions require confirmation by visiting the link sent to the
email address.
