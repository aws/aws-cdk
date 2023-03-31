# CDK Construct Library for Amazon Simple Notification Service Subscriptions


This library provides constructs for adding subscriptions to an Amazon SNS topic.
Subscriptions can be added by calling the `.addSubscription(...)` method on the topic.

## Subscriptions

Subscriptions can be added to the following endpoints:

* HTTPS
* Amazon SQS
* AWS Lambda
* Email
* SMS

Subscriptions to Amazon SQS and AWS Lambda can be added on topics across regions.

Create an Amazon SNS Topic to add subscriptions.

```ts
const myTopic = new sns.Topic(this, 'MyTopic');
```

### HTTPS

Add an HTTP or HTTPS Subscription to your topic:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.UrlSubscription('https://foobar.com/'));
```

The URL being subscribed can also be [tokens](https://docs.aws.amazon.com/cdk/latest/guide/tokens.html), that resolve
to a URL during deployment. A typical use case is when the URL is passed in as a [CloudFormation
parameter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html). The
following code defines a CloudFormation parameter and uses it in a URL subscription.

```ts
const myTopic = new sns.Topic(this, 'MyTopic');
const url = new CfnParameter(this, 'url-param');

myTopic.addSubscription(new subscriptions.UrlSubscription(url.valueAsString));
```

### Amazon SQS

Subscribe a queue to your topic:

```ts
const myQueue = new sqs.Queue(this, 'MyQueue');
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.SqsSubscription(myQueue));
```

KMS key permissions will automatically be granted to SNS when a subscription is made to
an encrypted queue.

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### AWS Lambda

Subscribe an AWS Lambda function to your topic:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const myTopic = new sns.Topic(this, 'myTopic');
declare const myFunction: lambda.Function;
myTopic.addSubscription(new subscriptions.LambdaSubscription(myFunction));
```

### Email

Subscribe an email address to your topic:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');
myTopic.addSubscription(new subscriptions.EmailSubscription('foo@bar.com'));
```

The email being subscribed can also be [tokens](https://docs.aws.amazon.com/cdk/latest/guide/tokens.html), that resolve
to an email address during deployment. A typical use case is when the email address is passed in as a [CloudFormation
parameter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html). The
following code defines a CloudFormation parameter and uses it in an email subscription.

```ts
const myTopic = new sns.Topic(this, 'Topic');
const emailAddress = new CfnParameter(this, 'email-param');

myTopic.addSubscription(new subscriptions.EmailSubscription(emailAddress.valueAsString));
```

Note that email subscriptions require confirmation by visiting the link sent to the
email address.

### SMS

Subscribe an sms number to your topic:

```ts
const myTopic = new sns.Topic(this, 'Topic');

myTopic.addSubscription(new subscriptions.SmsSubscription('+15551231234'));
```

The number being subscribed can also be [tokens](https://docs.aws.amazon.com/cdk/latest/guide/tokens.html), that resolve
to a number during deployment. A typical use case is when the number is passed in as a [CloudFormation
parameter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html). The
following code defines a CloudFormation parameter and uses it in an sms subscription.

```ts
const myTopic = new sns.Topic(this, 'Topic');
const smsNumber = new CfnParameter(this, 'sms-param');

myTopic.addSubscription(new subscriptions.SmsSubscription(smsNumber.valueAsString));
```
