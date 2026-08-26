import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const topic = new sns.Topic(this, 'T');

    fn.addEventSource(new SnsEventSource(topic));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new SqsEventSourceTest(app, 'lambda-event-source-sns');
app.synth();
