## Amazon Simple Notification Service Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

Add an SNS Topic to your stack:

```ts
import * as sns from '@aws-cdk/aws-sns';

const topic = new sns.Topic(this, 'Topic', {
    displayName: 'Customer subscription topic'
});
```

### Subscriptions

Various subscriptions can be added to the topic by calling the
`.addSubscription(...)` method on the topic. It accepts a *subscription* object,
default implementations of which can be found in the
`@aws-cdk/aws-sns-subscriptions` package:

Add an HTTPS Subscription to your topic:

```ts
import * as subs from '@aws-cdk/aws-sns-subscriptions';

const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subs.UrlSubscription('https://foobar.com/'));
```

Subscribe a queue to the topic:

```ts
myTopic.addSubscription(new subs.SqsSubscription(queue));
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

#### Filter policy
A filter policy can be specified when subscribing an endpoint to a topic.

Example with a Lambda subscription:
```ts
const myTopic = new sns.Topic(this, 'MyTopic');
const fn = new lambda.Function(this, 'Function', ...);

// Lambda should receive only message matching the following conditions on attributes:
// color: 'red' or 'orange' or begins with 'bl'
// size: anything but 'small' or 'medium'
// price: between 100 and 200 or greater than 300
// store: attribute must be present
topic.addSubscription(new subs.LambdaSubscription(fn, {
    filterPolicy: {
        color: sns.SubscriptionFilter.stringFilter({
            whitelist: ['red', 'orange'],
            matchPrefixes: ['bl']
        }),
        size: sns.SubscriptionFilter.stringFilter({
            blacklist: ['small', 'medium'],
        }),
        price: sns.SubscriptionFilter.numericFilter({
            between: { start: 100, stop: 200 },
            greaterThan: 300
        }),
        store: sns.SubscriptionFilter.existsFilter(),
    }
}));
```

### DLQ setup for SNS Subscription
CDK can attach provided Queue as DLQ for your SNS subscription.
See the [SNS DLQ configuration docs](https://docs.aws.amazon.com/sns/latest/dg/sns-configure-dead-letter-queue.html) for more information about this feature.

Example of usage with user provided DLQ.

```ts
const topic = new sns.Topic(stack, 'Topic');
const dlQueue = new Queue(stack, 'DeadLetterQueue', {
    queueName: 'MySubscription_DLQ',
    retentionPeriod: cdk.Duration.days(14),
});

new sns.Subscription(stack, 'Subscription', {
    endpoint: 'endpoint',
    protocol: sns.SubscriptionProtocol.LAMBDA,
    topic,
    deadLetterQueue: dlQueue,
});
```

### CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules.

Use the `@aws-cdk/aws-events-targets.SnsTopic`:

```ts
import * as targets from '@aws-cdk/aws-events-targets';

codeCommitRepository.onCommit(new targets.SnsTopic(myTopic));
```

This will result in adding a target to the event rule and will also modify the
topic resource policy to allow CloudWatch events to publish to the topic.
