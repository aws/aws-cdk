import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'S3NotificationMultiBucketPolicyTest');

// Create multiple buckets with notifications to verify per-bucket IAM policies
const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const bucket3 = new s3.Bucket(stack, 'Bucket3', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const topic = new sns.Topic(stack, 'Topic');

// Add notifications to each bucket - this should create separate HandlerPolicy for each
bucket1.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
bucket2.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.SnsDestination(topic));
bucket3.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));

new IntegTest(app, 'S3NotificationMultiBucketPolicyIntegTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
});
