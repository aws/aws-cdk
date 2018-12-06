import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { S3EventSource } from '../lib';
import { TestFunction } from './test-function';

class S3EventSourceTest extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    const fn = new TestFunction(this, 'F');
    const bucket = new s3.Bucket(this, 'B', {
      removalPolicy: cdk.RemovalPolicy.Destroy
    });

    fn.addEventSource(new S3EventSource(bucket, {
      events: [ s3.EventType.ObjectCreated ],
      filters: [ { prefix: 'subdir/' } ]
    }));
  }
}

const app = new cdk.App();
new S3EventSourceTest(app, 'lambda-event-source-s3');
app.run();
