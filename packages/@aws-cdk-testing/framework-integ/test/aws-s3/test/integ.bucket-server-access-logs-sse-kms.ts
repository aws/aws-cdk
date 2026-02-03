#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-server-access-logs-sse-kms');

const accessLogBucket = new s3.Bucket(stack, 'ServerAccessLogsBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  encryption: s3.BucketEncryption.KMS,
});

accessLogBucket.encryptionKey?.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

new s3.Bucket(stack, 'Bucket', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'ServerAccessLogsSseKmsTest', {
  testCases: [stack],
  diffAssets: true,
});
