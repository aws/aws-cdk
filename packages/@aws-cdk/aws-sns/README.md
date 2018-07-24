## AWS SNS Construct Library

Add an SNS Topic to your stack:

```ts
import sns = require('@aws-cdk/aws-sns');

const topic = new sns.Topic(stack, 'Topic', {
    displayName: 'Customer subscription topic'
});
```

### Subscriptions

Various subscriptions can be added to the topic by calling the `.subscribeXxx()` methods on the
topic.

Add an HTTPS Subscription to your topic:

```ts
const myTopic = new sns.Topic(stack, 'MyTopic');

myTopic.subscribeUrl('MyHttpsSubscription', 'https://foobar.com/');
```

Subscribe a queue to the topic:

[Example of subscribing a queue to a topic](test/integ.sns-sqs.lit.ts)

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules:

[Example of CloudWatch Event rules](examples/sns-codecommit-event-rule-target.lit.ts)

This will result in adding a target to the event rule and will also modify
the topic resource policy to allow CloudWatch events to publish to the topic.
