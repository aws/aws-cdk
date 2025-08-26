#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

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

// Add notifications to multiple buckets - this should create scoped IAM permissions
bucket1.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
bucket2.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.SnsDestination(topic));

new integ.IntegTest(app, 'ScopedPermissionsTest', {
  testCases: [stack],
});
