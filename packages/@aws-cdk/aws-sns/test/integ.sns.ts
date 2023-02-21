import { Key } from '@aws-cdk/aws-kms';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Topic, Tracing } from '../lib';

class SNSInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'CustomKey');

    new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName',
      masterKey: key,
    });

    new Topic(this, 'MyPassThroughTracingTopic', {
      topicName: 'passThroughTracingTopic',
      displayName: 'passThroughTracingDisplayName',
      masterKey: key,
      tracing: Tracing.PASS_THROUGH,
    });

    new Topic(this, 'MyActiveTracingTopic', {
      topicName: 'activeTracingTopic',
      displayName: 'activeTracingDisplayName',
      masterKey: key,
      tracing: Tracing.ACTIVE,
    });
  }
}

const app = new App();

new SNSInteg(app, 'SNSInteg');

app.synth();
