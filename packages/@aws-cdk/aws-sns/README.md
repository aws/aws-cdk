## Amazon Simple Notification Service Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

Add an SNS Topic to your stack:

```ts
import sns = require('@aws-cdk/aws-sns');

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
import subs = require('@aws-cdk/aws-sns-subscriptions');

const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subs.UrlSubscription('https://foobar.com/'));
```

Subscribe a queue to the topic:

```ts
myTopic.addSubscription(new subs.SqsSubscription(queue));
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

### CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules.

Use the `@aws-cdk/aws-events-targets.SnsTopicTarget`:

```ts
import targets = require('@aws-cdk/aws-events-targets');

codeCommitRepository.onCommit(new targets.SnsTopicTarget(myTopic));
```

This will result in adding a target to the event rule and will also modify the
topic resource policy to allow CloudWatch events to publish to the topic.
