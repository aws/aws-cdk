#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

// Reproduces the issues experienced in #23588 and #23547, both resulting from
// not validating log delivery is applied correctly when the target bucket for
// server access logs is in another account.
const app = new cdk.App();
const targetBucketStack = new cdk.Stack(app, 'aws-cdk-s3-access-logs-target');
const sourceBucketStack = new cdk.Stack(app, 'aws-cdk-s3-access-logs-delivery');

const targetBucket = new s3.Bucket(targetBucketStack, 'TargetBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
  encryption: s3.BucketEncryption.S3_MANAGED,
  accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
});
new s3.Bucket(sourceBucketStack, 'SourceBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
  encryption: s3.BucketEncryption.S3_MANAGED,
  accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  serverAccessLogsBucket: targetBucket,
  serverAccessLogsPrefix: 'test/',
});

new integ.IntegTest(app, 'ServerAccessLogsImportTest', {
  testCases: [sourceBucketStack],
  diffAssets: true,
});
