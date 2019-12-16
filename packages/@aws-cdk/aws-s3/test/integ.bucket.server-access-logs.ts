#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import s3 = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-access-logs');

const accessLogBucket = new s3.Bucket(stack, 'MyAccessLogsBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
});

new s3.Bucket(stack, 'MyBucket', {
  serverAccessLogsBucket: accessLogBucket,
  serverAccessLogsPrefix: 'example',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

app.synth();
