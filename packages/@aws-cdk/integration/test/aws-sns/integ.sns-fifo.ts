import { Topic } from '@aws-cdk/aws-sns';
import { App, Stack, StackProps } from '@aws-cdk/core';

class SNSFifoInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName',
      contentBasedDeduplication: true,
      fifo: true,
    });
  }
}

const app = new App();

new SNSFifoInteg(app, 'SNSFifoInteg');

app.synth();
