import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

class SqsProvisionedPollersTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new sqs.Queue(this, 'Q');

    fn.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
      provisionedPollerConfig: {
        minimumPollers: 2,
        maximumPollers: 10,
      },
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new SqsProvisionedPollersTest(app, 'sqs-event-source-provisioned-pollers');

new IntegTest(app, 'sqs-provisioned-pollers-integ-test', {
  testCases: [stack],
});

app.synth();
