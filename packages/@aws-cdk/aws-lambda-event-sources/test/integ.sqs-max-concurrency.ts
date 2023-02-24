import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { TestFunction } from './test-function';
import { SqsEventSource } from '../lib';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new sqs.Queue(this, 'Q');

    fn.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
      maxConcurrency: 5,
    }));
  }
}

const app = new cdk.App();
const stack = new SqsEventSourceTest(app, 'sqs-event-source-max-concurrency');

new IntegTest(app, 'sqs-max-concurrency-integ-test', {
  testCases: [stack],
});

app.synth();
