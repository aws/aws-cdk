import { Key } from '../../aws-kms';
import { App, Stack, StackProps } from '../../core';
import { Topic } from '../lib';

class SNSInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'CustomKey');

    new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName',
      masterKey: key,
    });
  }
}

const app = new App();

new SNSInteg(app, 'SNSInteg');

app.synth();
