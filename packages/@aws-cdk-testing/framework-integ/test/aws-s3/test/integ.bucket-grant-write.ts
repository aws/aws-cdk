#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const user = new iam.User(stack, 'MyUser');

bucket.grantWrite(user, '*', ['s3:PutObject', 's3:DeleteObject*']);

new integ.IntegTest(app, 'BucketGrantWriteTest', {
  testCases: [stack],
});

app.synth();
