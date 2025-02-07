import { Key } from 'aws-cdk-lib/aws-kms';
import { App, Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { User } from 'aws-cdk-lib/aws-iam';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class SNSInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'CustomKey', {
      pendingWindow: Duration.days(7),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const topic = new Topic(this, 'MyTopic', {
      masterKey: key,
    });

    const user = new User(this, 'MyUser');

    topic.grantSubscribe(user);
  }
}

const app = new App();

const stack = new SNSInteg(app, 'sns-grant-subscribe-stack');

new IntegTest(app, 'sns-grant-subscribe-test', {
  testCases: [stack],
});

app.synth();
