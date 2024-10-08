import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new cdk.Stack(app, 'test-3');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const topic = new sns.Topic(stack, 'Topic');
const topic3 = new sns.Topic(stack, 'Topic3');

bucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));
bucket.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.SnsDestination(topic3), { prefix: 'home/myusername/' });

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
bucket2.addObjectRemovedNotification(new s3n.SnsDestination(topic3), { prefix: 'foo' }, { suffix: 'foo/bar' });

const bucket3 = new s3.Bucket(stack, 'Bucket3', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const importedBucket3 = s3.Bucket.fromBucketName(stack, 'Bucket3Imported', bucket3.bucketName);
importedBucket3.addEventNotification(s3.EventType.OBJECT_CREATED_COPY, new s3n.SnsDestination(topic3));

app.synth();
