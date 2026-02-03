import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class MyStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  public readonly queue: sqs.IQueue;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'Key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const topic = new sns.Topic(this, 'Topic', {
      masterKey: kmsKey,
    });

    this.queue = new sqs.Queue(this, 'Queue');
    topic.addSubscription(new subscriptions.SqsSubscription(this.queue));

    this.bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.bucket.addObjectCreatedNotification(new s3n.SnsDestination(topic));
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/s3-notifications:addS3TrustKeyPolicyForSnsSubscriptions': true,
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new MyStack(app, 'SnsBucketNotificationsStack');

const integ = new IntegTest(app, 'SnsBucketNotificationsSseInteg', {
  testCases: [stack],
});

const putObject = integ.assertions.awsApiCall('S3', 'putObject', {
  Bucket: stack.bucket.bucketName,
  Key: 'testFile.json',
  Body: JSON.stringify([
    { objectId: 1 },
    { objectId: 2 },
  ]),
});

putObject.next(integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
})).expect(ExpectedResult.objectLike({
  // Receive at least 1 message
  Messages: [{}],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(15),
});
