#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-access-logs');

const accessLogBucket = new s3.Bucket(stack, 'MyAccessLogsBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new s3.Bucket(stack, 'MyBucket', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new s3.Bucket(stack, 'MyBucket2', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example2',
  targetObjectKeyFormat: s3.TargetObjectKeyFormat.simplePrefix(),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new s3.Bucket(stack, 'MyBucket3', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example3',
  targetObjectKeyFormat: s3.TargetObjectKeyFormat.partitionedPrefix(s3.PartitionDateSource.EVENT_TIME),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new s3.Bucket(stack, 'MyBucket4', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example4',
  targetObjectKeyFormat: s3.TargetObjectKeyFormat.partitionedPrefix(s3.PartitionDateSource.DELIVERY_TIME),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new s3.Bucket(stack, 'MyBucket5', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example5',
  targetObjectKeyFormat: s3.TargetObjectKeyFormat.partitionedPrefix(),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cdk-integ-s3-access-logs', {
  testCases: [stack],
});
