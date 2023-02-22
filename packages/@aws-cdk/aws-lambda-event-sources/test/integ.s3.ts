import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { TestFunction } from './test-function';
import { S3EventSource } from '../lib';

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

const app = new cdk.App();
new S3EventSourceTest(app, 'lambda-event-source-s3');
app.synth();
