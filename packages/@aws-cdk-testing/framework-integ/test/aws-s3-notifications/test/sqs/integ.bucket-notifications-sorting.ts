import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { SqsDestination } from 'aws-cdk-lib/aws-s3-notifications';

class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'MyQueue');
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new SqsDestination(queue),
      {
        prefix: 'foo/',
        suffix: 'bar/',
      },
    );

    // To test sorting in notification object is working properly,
    // Make a deployment with following code commented out.
    // Then uncomment the code and make a deployment again. The deployment should succeed.

    // bucket.addEventNotification(
    //   s3.EventType.OBJECT_CREATED_PUT,
    //   new SqsDestination(queue),
    //   {
    //     prefix: 'fo1/',
    //     suffix: 'ba2/',
    //   },
    // );
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new MyStack(app, 'sns-bucket-notifications');

new integ.IntegTest(app, 'BucketNotificationsSortingTest', {
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
  testCases: [stack],
  diffAssets: true,
});

app.synth();
