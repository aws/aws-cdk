/// !cdk-integ *
import * as sns from '@aws-cdk/aws-sns';
import { App, Construct, Fn, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

// references between siblings

class ProducerNestedStack extends cfn.NestedStack {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'MyTopic');
  }
}

class ConsumerNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, topic: sns.Topic) {
    super(scope, id);

    new sns.Topic(this, 'ConsumerTopic', {
      displayName: `Consuming ${Fn.select(2, Fn.split('-', topic.topicName))}`, // just shorten because display name is limited
    });
  }
}

class ParentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const nested = new ProducerNestedStack(this, 'Nested1');
    new ConsumerNestedStack(this, 'Nested2', nested.topic);
  }
}

const app = new App();

new ParentStack(app, 'nested-stacks-refs3-siblings');

app.synth();
