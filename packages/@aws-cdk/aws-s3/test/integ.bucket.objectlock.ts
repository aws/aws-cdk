import * as cdk from '@aws-cdk/core';
import { Bucket, DefaultRetentionMode } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-object-lock');

// Test object lock
new Bucket(stack, 'MyBucket', {
  objectLockEnabled: true,
  objectLockConfiguration: {
    rule: {
      defaultRetention: {
        days: cdk.Duration.days(7),
        mode: DefaultRetentionMode.GOVERNANCE,
      },
    },
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

app.synth();
