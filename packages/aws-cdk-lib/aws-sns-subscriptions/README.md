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
* Amazon Data Firehose

Subscriptions to Amazon SQS, AWS Lambda and Amazon Data Firehose can be added on topics across regions.

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

The [delivery policy](https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html) can also be set like so:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(
  new subscriptions.UrlSubscription(
    'https://foobar.com/',
    {
      deliveryPolicy: {
        healthyRetryPolicy: {
          minDelayTarget: Duration.seconds(5),
          maxDelayTarget: Duration.seconds(10),
          numRetries: 6,
          backoffFunction: sns.BackoffFunction.EXPONENTIAL,
        },
        throttlePolicy: {
          maxReceivesPerSecond: 10,
        },
        requestPolicy: {
          headerContentType: 'application/json',
        },
      },
    },
  ),
);
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

### Amazon Data Firehose

Subscribe an Amazon Data Firehose delivery stream to your topic:

```ts
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

const myTopic = new sns.Topic(this, 'Topic');
declare const stream: firehose.DeliveryStream;

myTopic.addSubscription(new subscriptions.FirehoseSubscription(stream));
```

To remove any Amazon SNS metadata from published messages, specify `rawMessageDelivery` to true.

```ts
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

const myTopic = new sns.Topic(this, 'Topic');
declare const stream: firehose.DeliveryStream;

myTopic.addSubscription(new subscriptions.FirehoseSubscription(stream, {
  rawMessageDelivery: true,
}));
```

### Cross-region delivery from opt-in regions

Amazon SNS supports cross-region delivery to Lambda functions and SQS queues, but
when one of the regions involved is an [opt-in region][opt-in-regions]
(`ap-east-1`, `me-south-1`, `eu-south-1`, `af-south-1`, `il-central-1`, etc.),
the subscriber's resource policy must trust a regionalized SNS service principal
(`sns.<region>.amazonaws.com`) instead of the default `sns.amazonaws.com`.

Configure this with the `additionalServicePrincipalRegions` prop on
`LambdaSubscription` or `SqsSubscription`:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const myFunction: lambda.Function;

// Topic in an opt-in region (ap-east-1) delivering to a Lambda in a
// default-enabled region: the Lambda permission needs to trust
// `sns.ap-east-1.amazonaws.com` in addition to the default principal.
const myTopic = new sns.Topic(this, 'MyTopic');
myTopic.addSubscription(new subscriptions.LambdaSubscription(myFunction, {
  additionalServicePrincipalRegions: ['ap-east-1'],
}));
```

The same prop is available on `SqsSubscription`. To grant only the regionalized
principal (for example, when the topic is in an opt-in region and the subscriber
should not accept invocations from default-enabled regions at all), set
`includeDefaultServicePrincipal` to `false`:

```ts
declare const myQueue: sqs.Queue;
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.SqsSubscription(myQueue, {
  includeDefaultServicePrincipal: false,
  additionalServicePrincipalRegions: ['ap-east-1'],
}));
```

See the AWS docs on [cross-region SNS delivery][cross-region-delivery] for the
full set of supported scenarios and the rules for which region's principal must
be granted.

[opt-in-regions]: https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html#opt-in-regions
[cross-region-delivery]: https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html
