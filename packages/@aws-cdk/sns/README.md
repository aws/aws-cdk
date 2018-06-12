## AWS SNS Construct Library

Add an SNS Topic to your stack:

```ts
import { Topic } from '@aws-cdk/sns';

const topic = new Topic(stack, 'Topic', {
    displayName: 'Customer subscription topic'
});
```

### Subscriptions

Various subscriptions can be added to the topic by calling the `.subscribeXxx()` methods on the
topic.

Add an HTTPS Subscription to your topic:

```ts
const myTopic = new Topic(stack, 'MyTopic');

myTopic.subscribeUrl('MyHttpsSubscription', 'https://foobar.com/');
```

Subscribe a queue to the topic:

```ts
const myTopic = new Topic(stack, 'MyTopic');
const queue = new Queue(stack, 'MyQueue');

myTopic.subscribeQueue(queue);
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules:

```ts
const myTopic = new Topic(this, 'MyTopic');
const rule = new EventRule(this, 'Rule', { /* ... */ });

rule.addTarget(myTopic);

// or use as a target in an onXxx method
codeCommitRepo.onCommit('OnCommit', myTopic);
```

This will result in adding a target to the event rule and will also modify the topic resource
policy to allow CloudWatch events to publish to the topic.
