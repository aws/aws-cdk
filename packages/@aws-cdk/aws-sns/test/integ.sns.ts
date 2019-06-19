import { App, PhysicalName, Stack, StackProps } from '@aws-cdk/cdk';
import { Topic } from '../lib';

class SNSInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new Topic(this, 'MyTopic', {
      topicName: PhysicalName.of('fooTopic'),
      displayName: 'fooDisplayName'
    });
  }
}

const app = new App();

new SNSInteg(app, 'SNSInteg');

app.synth();
