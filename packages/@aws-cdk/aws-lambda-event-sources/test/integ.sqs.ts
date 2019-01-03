import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { SqsEventSource } from '../lib';
import { TestFunction } from './test-function';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new sqs.Queue(this, 'Q');

    fn.addEventSource(new SqsEventSource(queue, {
      batchSize: 5
    }));
  }
}

const app = new cdk.App();
new SqsEventSourceTest(app, 'lambda-event-source-sqs');
app.run();