/// !cdk-integ *
import * as sns from '@aws-cdk/aws-sns';
import { App, Fn, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

// references between siblings

/* eslint-disable cdk/no-core-construct */

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
