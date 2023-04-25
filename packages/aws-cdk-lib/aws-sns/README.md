# Amazon Simple Notification Service Construct Library


Add an SNS Topic to your stack:

```ts
const topic = new sns.Topic(this, 'Topic', {
  displayName: 'Customer subscription topic',
});
```

Add a FIFO SNS topic with content-based de-duplication to your stack:

```ts
const topic = new sns.Topic(this, 'Topic', {
  contentBasedDeduplication: true,
  displayName: 'Customer subscription topic',
  fifo: true,
});
```

Note that FIFO topics require a topic name to be provided. The required `.fifo` suffix will be automatically generated and added to the topic name if it is not explicitly provided.

## Subscriptions

Various subscriptions can be added to the topic by calling the
`.addSubscription(...)` method on the topic. It accepts a *subscription* object,
default implementations of which can be found in the
`@aws-cdk/aws-sns-subscriptions` package:

Add an HTTPS Subscription to your topic:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.UrlSubscription('https://foobar.com/'));
```

Subscribe a queue to the topic:

```ts
declare const queue: sqs.Queue;
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.SqsSubscription(queue));
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### Filter policy

A filter policy can be specified when subscribing an endpoint to a topic.

Example with a Lambda subscription:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const myTopic = new sns.Topic(this, 'MyTopic');
declare const fn: lambda.Function;

// Lambda should receive only message matching the following conditions on attributes:
// color: 'red' or 'orange' or begins with 'bl'
// size: anything but 'small' or 'medium'
// price: between 100 and 200 or greater than 300
// store: attribute must be present
myTopic.addSubscription(new subscriptions.LambdaSubscription(fn, {
  filterPolicy: {
    color: sns.SubscriptionFilter.stringFilter({
      allowlist: ['red', 'orange'],
      matchPrefixes: ['bl'],
    }),
    size: sns.SubscriptionFilter.stringFilter({
      denylist: ['small', 'medium'],
    }),
    price: sns.SubscriptionFilter.numericFilter({
      between: { start: 100, stop: 200 },
      greaterThan: 300,
    }),
    store: sns.SubscriptionFilter.existsFilter(),
  },
}));
```

#### Payload-based filtering

To filter messages based on the payload or body of the message, use the `filterPolicyWithMessageBody` property. This type of filter policy supports creating filters on nested objects.

Example with a Lambda subscription:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const myTopic = new sns.Topic(this, 'MyTopic');
declare const fn: lambda.Function;

// Lambda should receive only message matching the following conditions on message body:
// color: 'red' or 'orange'
myTopic.addSubscription(new subscriptions.LambdaSubscription(fn, {
  filterPolicyWithMessageBody: {
    background: sns.FilterOrPolicy.policy({
      color: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
        allowlist: ['red', 'orange'],
      })),
    }),
  },
}));
```

### Example of Firehose Subscription

```ts
import { DeliveryStream } from '@aws-cdk/aws-kinesisfirehose-alpha';

const topic = new sns.Topic(this, 'Topic');
declare const stream: DeliveryStream;

new sns.Subscription(this, 'Subscription', {
  topic,
  endpoint: stream.deliveryStreamArn,
  protocol: sns.SubscriptionProtocol.FIREHOSE,
  subscriptionRoleArn: "SAMPLE_ARN", //role with permissions to send messages to a firehose delivery stream
});
```

## DLQ setup for SNS Subscription

CDK can attach provided Queue as DLQ for your SNS subscription.
See the [SNS DLQ configuration docs](https://docs.aws.amazon.com/sns/latest/dg/sns-configure-dead-letter-queue.html) for more information about this feature.

Example of usage with user provided DLQ.

```ts
const topic = new sns.Topic(this, 'Topic');
const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
  queueName: 'MySubscription_DLQ',
  retentionPeriod: Duration.days(14),
});

new sns.Subscription(this, 'Subscription', {
  endpoint: 'endpoint',
  protocol: sns.SubscriptionProtocol.LAMBDA,
  topic,
  deadLetterQueue: dlQueue,
});
```

## CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules.

Use the `@aws-cdk/aws-events-targets.SnsTopic`:

```ts
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const repo: codecommit.Repository;
const myTopic = new sns.Topic(this, 'Topic');

repo.onCommit('OnCommit', {
  target: new targets.SnsTopic(myTopic),
});
```

This will result in adding a target to the event rule and will also modify the
topic resource policy to allow CloudWatch events to publish to the topic.

## Topic Policy

A topic policy is automatically created when `addToResourcePolicy` is called, if
one doesn't already exist. Using `addToResourcePolicy` is the simplest way to
add policies, but a `TopicPolicy` can also be created manually.

```ts
const topic = new sns.Topic(this, 'Topic');
const topicPolicy = new sns.TopicPolicy(this, 'TopicPolicy', {
  topics: [topic],
});

topicPolicy.document.addStatements(new iam.PolicyStatement({
  actions: ["sns:Subscribe"],
  principals: [new iam.AnyPrincipal()],
  resources: [topic.topicArn],
}));
```

A policy document can also be passed on `TopicPolicy` construction

```ts
const topic = new sns.Topic(this, 'Topic');
const policyDocument = new iam.PolicyDocument({
  assignSids: true,
  statements: [
    new iam.PolicyStatement({
      actions: ["sns:Subscribe"],
      principals: [new iam.AnyPrincipal()],
      resources: [topic.topicArn],
    }),
  ],
});

const topicPolicy = new sns.TopicPolicy(this, 'Policy', {
  topics: [topic],
  policyDocument,
});
```
