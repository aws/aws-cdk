/// !cdk-integ *
import * as sns from '@aws-cdk/aws-sns';
import { App, Construct, Fn, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

// non-nested non-parent stack consumes a resource from a nested stack

/* eslint-disable cdk/no-core-construct */

class ProducerNestedStack extends cfn.NestedStack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'MyTopic');
  }
}

class ParentStack extends Stack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const nested = new ProducerNestedStack(this, 'Nested1');
    this.topic = nested.topic;
  }
}

class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, topic: sns.Topic) {
    super(scope, id);

    new sns.Topic(this, 'ConsumerTopic', {
      displayName: `Consuming ${Fn.select(2, Fn.split('-', topic.topicName))}`, // just shorten because display name is limited
    });
  }
}

const app = new App();
const parent = new ParentStack(app, 'nested-stacks-refs2-parent-with-producer');
new ConsumerStack(app, 'nested-stacks-refs2-consumer', parent.topic);
app.synth();
