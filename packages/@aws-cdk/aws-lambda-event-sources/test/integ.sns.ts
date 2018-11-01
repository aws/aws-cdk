import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { SnsEventSource } from '../lib';
import { TestFunction } from './test-function';

class SqsEventSourceTest extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    const fn = new TestFunction(this, 'F');
    const topic = new sns.Topic(this, 'T');

    fn.addEventSource(new SnsEventSource(topic));
  }
}

const app = new cdk.App();
new SqsEventSourceTest(app, 'lambda-event-source-sns');
app.run();