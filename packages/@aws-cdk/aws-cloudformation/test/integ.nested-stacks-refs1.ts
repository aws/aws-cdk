/// !cdk-integ *

// nested stack references a resource from a non-nested non-parent stack

/* eslint-disable @aws-cdk/no-core-construct */

import * as sns from '@aws-cdk/aws-sns';
import { App, NestedStack, Stack } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

class ConsumerNestedStack extends NestedStack {
  constructor(scope: Construct, id: string, topic: sns.Topic) {
    super(scope, id);

    new sns.Topic(this, 'ConsumerTopic', {
      displayName: `Consumer of ${topic.topicName}`,
    });
  }
}

class ProducerStack extends Stack {
  public readonly topic: sns.Topic;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'MyTopic');
  }
}

class ParentStack extends Stack {
  constructor(scope: Construct, id: string, topic: sns.Topic) {
    super(scope, id);

    new ConsumerNestedStack(this, 'Nested1', topic);
  }
}

const app = new App();
const producer = new ProducerStack(app, 'nest-stacks-refs1-producer');
new ParentStack(app, 'nested-stacks-refs1-parent-with-consumer', producer.topic);
app.synth();
