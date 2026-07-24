import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic, ITopic } from 'aws-cdk-lib/aws-sns';
import { User } from 'aws-cdk-lib/aws-iam';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class SNSGrantsPropertyInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a topic
    const topic = new Topic(this, 'MyTopic');

    // Use the topic as ITopic to verify grants property is accessible on the interface
    const topicAsInterface: ITopic = topic;

    const user = new User(this, 'MyUser');

    // Use the grants property (available on both Topic and ITopic)
    topicAsInterface.grants.publish(user);
  }
}

const app = new App();

const stack = new SNSGrantsPropertyInteg(app, 'sns-grants-property-stack');

new IntegTest(app, 'sns-grants-property-test', {
  testCases: [stack],
});

app.synth();
