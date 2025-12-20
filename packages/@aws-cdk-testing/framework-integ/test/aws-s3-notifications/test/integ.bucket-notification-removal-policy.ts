import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for S3 bucket notifications with RemovalPolicy.RETAIN
 * This test specifically validates that stack deletion succeeds even when
 * the bucket is deleted before the notification custom resource cleanup,
 * addressing the NoSuchBucket error scenario fixed in issue #35352.
 */
const app = new cdk.App();

const stack = new cdk.Stack(app, 'S3NotificationRemovalPolicyStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Create an S3 bucket with RETAIN removal policy
const bucketWithRetainPolicy = new s3.Bucket(stack, 'BucketWithRetainPolicy', {
  removalPolicy: cdk.RemovalPolicy.RETAIN,
  autoDeleteObjects: false,
  encryption: s3.BucketEncryption.S3_MANAGED,
});

// Create an SNS topic for notifications
const notificationTopic = new sns.Topic(stack, 'NotificationTopic', {
  displayName: 'S3 Notification Topic for RemovalPolicy Test',
});

// Add event notification to the bucket
// This creates the custom resource that could encounter NoSuchBucket errors
bucketWithRetainPolicy.addEventNotification(
  s3.EventType.OBJECT_CREATED,
  new s3n.SnsDestination(notificationTopic),
  { prefix: 'uploads/' },
);

// Also test with DESTROY policy for comparison
const bucketWithDestroyPolicy = new s3.Bucket(stack, 'BucketWithDestroyPolicy', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
});

bucketWithDestroyPolicy.addEventNotification(
  s3.EventType.OBJECT_REMOVED,
  new s3n.SnsDestination(notificationTopic),
  { suffix: '.txt' },
);

// Output the bucket names for verification
new cdk.CfnOutput(stack, 'RetainBucketName', {
  value: bucketWithRetainPolicy.bucketName,
  description: 'Name of the S3 bucket with RETAIN removal policy',
});

new cdk.CfnOutput(stack, 'DestroyBucketName', {
  value: bucketWithDestroyPolicy.bucketName,
  description: 'Name of the S3 bucket with DESTROY removal policy',
});

new cdk.CfnOutput(stack, 'TopicArn', {
  value: notificationTopic.topicArn,
  description: 'ARN of the SNS topic receiving notifications',
});

// Create integration test
new IntegTest(app, 'S3NotificationRemovalPolicyIntegTest', {
  testCases: [stack],
  diffAssets: true,
  allowDestroy: ['AWS::CDK::Metadata'],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});
