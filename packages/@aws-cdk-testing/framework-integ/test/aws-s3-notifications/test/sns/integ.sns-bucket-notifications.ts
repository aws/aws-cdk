import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

/*
 * * Creates a S3 event notification that publishes to an SNS topic.
 *
 * Stack verification steps:
 * Create a text file, upload to S3, and validate publication to SNS topic.
 * Create a subscription for the SNS topic or check CloudWatch metrics to validate message was published.
 *
 * -- echo "This is test for S3 event notifications and SNS" > test.txt
 * -- aws s3 cp test.txt s3://<BUCKET_NAME>/test.txt
 */
class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const objectCreateTopic = new sns.Topic(this, 'ObjectCreatedTopic');
    const objectRemovedTopic = new sns.Topic(this, 'ObjectDeletedTopic');
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    bucket.addObjectCreatedNotification(new s3n.SnsDestination(objectCreateTopic));
    bucket.addObjectRemovedNotification(new s3n.SnsDestination(objectRemovedTopic), { prefix: 'foo/', suffix: '.txt' });

  }
}

const app = new cdk.App();

new MyStack(app, 'sns-bucket-notifications');

app.synth();
