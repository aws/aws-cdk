import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

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

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new SqsEventSourceTest(app, 'sqs-event-source-max-concurrency');

new IntegTest(app, 'sqs-max-concurrency-integ-test', {
  testCases: [stack],
});

app.synth();
