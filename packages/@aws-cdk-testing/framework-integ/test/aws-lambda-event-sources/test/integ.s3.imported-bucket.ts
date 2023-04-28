import { App, Stack } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { randomUUID } from 'node:crypto';

const bucketName = randomUUID();
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
    new S3EventSource(importBucket, {
      events: [
        EventType.OBJECT_CREATED,
      ],
    });
  }
}

const app = new App();

new IntegTest(app, 'issue-4323', {
  testCases: [
    new TestStack(app, 'tester'),
  ],
});