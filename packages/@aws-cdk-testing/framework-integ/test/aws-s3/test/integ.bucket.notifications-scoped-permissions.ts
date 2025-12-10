#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Match, Template } from 'aws-cdk-lib/assertions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-notifications-scoped-permissions');

// Create multiple buckets to test consolidated policy with scoped permissions
const bucket1 = new s3.Bucket(stack, 'Bucket1', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const bucket2 = new s3.Bucket(stack, 'Bucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const topic = new sns.Topic(stack, 'Topic');
const queue = new sqs.Queue(stack, 'Queue', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Add notifications to multiple buckets with different event types - this should create scoped IAM permissions
bucket1.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));
bucket1.addEventNotification(s3.EventType.OBJECT_CREATED_POST, new s3n.SqsDestination(queue));
bucket2.addEventNotification(s3.EventType.OBJECT_REMOVED_DELETE, new s3n.SnsDestination(topic));
bucket2.addEventNotification(s3.EventType.OBJECT_REMOVED_DELETE_MARKER_CREATED, new s3n.SnsDestination(topic));

// Create integration test with snapshot comparison enabled
new integ.IntegTest(app, 'ScopedPermissionsTest', {
  testCases: [stack],
  diffAssets: true,
});

// Add assertions to verify IAM policies are scoped to specific bucket ARNs
const template = Template.fromStack(stack);

// Verify that IAM policies do not contain wildcard permissions
template.hasResourceProperties('AWS::IAM::Policy', {
  PolicyDocument: {
    Statement: Match.arrayWith([
      Match.objectLike({
        Effect: 'Allow',
        Action: 's3:PutBucketNotification',
        Resource: Match.not('*'), // Ensure no wildcard permissions
      }),
    ]),
  },
});

// Verify that the IAM policy contains specific bucket ARNs
template.hasResourceProperties('AWS::IAM::Policy', {
  PolicyDocument: {
    Statement: Match.arrayWith([
      Match.objectLike({
        Effect: 'Allow',
        Action: 's3:PutBucketNotification',
        Resource: Match.arrayWith([
          Match.objectLike({
            'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Bucket[12]'), 'Arn']),
          }),
        ]),
      }),
    ]),
  },
});
