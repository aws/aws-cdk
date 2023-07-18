import { Key } from 'aws-cdk-lib/aws-kms';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';

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
