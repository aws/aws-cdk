import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class S3EventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const bucket = new s3.Bucket(this, 'B', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    fn.addEventSource(new S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: 'subdir/' }],
    }));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new S3EventSourceTest(app, 'lambda-event-source-s3');
new IntegTest(app, 'LambdaEventSourceS3Integ', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
