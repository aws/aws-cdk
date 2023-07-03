#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3-bucket-object-lock');

new s3.Bucket(stack, 'ObjectLockBucket', {
  objectLockEnabled: true,
});

new s3.Bucket(stack, 'ObjectLockWithRetentionBucket', {
  objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(2)),
});

new integ.IntegTest(app, 'ServerAccessLogsImportTest', {
  testCases: [stack],
});
