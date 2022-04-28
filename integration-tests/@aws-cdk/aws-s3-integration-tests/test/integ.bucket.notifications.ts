#!/usr/bin/env node
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-notifications');

new s3.Bucket(stack, 'MyEventBridgeBucket', {
  eventBridgeEnabled: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

app.synth();
