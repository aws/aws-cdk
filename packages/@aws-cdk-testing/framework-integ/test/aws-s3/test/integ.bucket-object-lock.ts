#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stackWithRetention = new cdk.Stack(app, 'aws-cdk-s3-bucket-object-lock-with-retention');

new s3.Bucket(stackWithRetention, 'ObjectLockRetentionTransitionBucket', {
  objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(2)),
});

const stackWithoutRetention = new cdk.Stack(app, 'aws-cdk-s3-bucket-object-lock-no-retention');

new s3.Bucket(stackWithoutRetention, 'ObjectLockWithoutRetentionBucket', {
  objectLockEnabled: true,
});

new s3.Bucket(stackWithoutRetention, 'ObjectLockRetentionTransitionBucket', {
  objectLockEnabled: true,
});

new integ.IntegTest(app, 'ServerAccessLogsImportTest', {
  testCases: [stackWithRetention, stackWithoutRetention],
});
