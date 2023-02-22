import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { TestFunction } from './test-function';
import { SqsEventSource } from '../lib';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new sqs.Queue(this, 'Q');

    fn.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
    }));
  }
}

const app = new cdk.App();
new SqsEventSourceTest(app, 'lambda-event-source-sqs');
app.synth();
