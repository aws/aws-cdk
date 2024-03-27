import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';

class SNSFifoInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName',
      contentBasedDeduplication: true,
      fifo: true,
    });

    // Can import topic from attributes
    Topic.fromTopicAttributes(this, 'ImportedTopic', {
      topicArn: topic.topicArn,
      contentBasedDeduplication: true,
    });
  }
}

const app = new App();

new SNSFifoInteg(app, 'SNSFifoInteg');

app.synth();
