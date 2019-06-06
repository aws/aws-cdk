## Amazon Simple Notification Service Construct Library
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


Add an SNS Topic to your stack:

```ts
import sns = require('@aws-cdk/aws-sns');

const topic = new sns.Topic(this, 'Topic', {
    displayName: 'Customer subscription topic'
});
```

### Subscriptions

Various subscriptions can be added to the topic by calling the `.subscribeXxx()` methods on the
topic.

Add an HTTPS Subscription to your topic:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.subscribeUrl('MyHttpsSubscription', 'https://foobar.com/');
```

Subscribe a queue to the topic:

[Example of subscribing a queue to a topic](test/integ.sns-sqs.lit.ts)

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
