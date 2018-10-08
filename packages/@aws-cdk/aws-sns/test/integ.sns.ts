import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Topic } from '../lib';

class SNSInteg extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    new Topic(this, 'MyTopic', {
      topicName: 'fooTopic',
      displayName: 'fooDisplayName'
    });
  }
}

const app = new App();

new SNSInteg(app, 'SNSInteg');

app.run();
