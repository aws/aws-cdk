#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as s3 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-notifications');

new s3.Bucket(stack, 'MyEventBridgeBucket', {
  eventBridgeEnabled: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'NotificationTest', {
  testCases: [stack],
});
