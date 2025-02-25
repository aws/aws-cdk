#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-s3-notifications');

new s3.Bucket(stack, 'MyEventBridgeBucket', {
  eventBridgeEnabled: true,
  enforceSSL: true, // Adding dummy bucket policy for testing that bucket policy is created before bucket notification
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'NotificationTest', {
  testCases: [stack],
});
