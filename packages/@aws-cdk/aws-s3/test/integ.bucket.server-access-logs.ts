#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as s3 from '../lib';

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

app.synth();
