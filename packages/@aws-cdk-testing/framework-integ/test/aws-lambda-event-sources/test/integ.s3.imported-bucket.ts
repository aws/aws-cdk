import { App, Stack } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { S3EventSourceV2 } from 'aws-cdk-lib/aws-lambda-event-sources';
import { TestFunction } from './test-function';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const bucketName = 'cdk-test-bucket-event-source';
class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const setupStack = new class extends Stack {
      constructor() {
        super(scope, id + 'setup');
        new Bucket(this, 'bucket', {
          bucketName,
        });
      }
    }();

    const importBucket = Bucket.fromBucketName(this, 'Imported', bucketName);
    importBucket.node.addDependency(setupStack);

    const fn = new TestFunction(this, 'F');
    fn.addEventSource(new S3EventSourceV2(importBucket, {
      events: [
        EventType.OBJECT_CREATED,
      ],
    }));
  }
}

const app = new App();

new IntegTest(app, 'issue-4324', {
  testCases: [
    new TestStack(app, 'tester'),
  ],
});