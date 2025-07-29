import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

class SqsEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new sqs.Queue(this, 'Q');
    const eventSource = new SqsEventSource(queue, {
      batchSize: 5,
    });

    fn.addEventSource(eventSource);

    new cdk.CfnOutput(this, 'OutputEventSourceMappingArn', { value: eventSource.eventSourceMappingArn });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new SqsEventSourceTest(app, 'lambda-event-source-sqs');
app.synth();
