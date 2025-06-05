import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { S3EventSourceV2 } from 'aws-cdk-lib/aws-lambda-event-sources';
import { TestFunction } from './test-function';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack1 = new Stack(app, 'TestStack1');
const stack2 = new Stack(app, 'TestStack2');

const bucket = new Bucket(stack1, 'bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const fn = new TestFunction(stack2, 'F');
fn.addEventSource(new S3EventSourceV2(Bucket.fromBucketName(stack2, 'Imported', bucket.bucketName), {
  events: [
    EventType.OBJECT_CREATED,
  ],
}));

new IntegTest(app, 'issue-4324', {
  testCases: [
    stack2,
  ],
});
