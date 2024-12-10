#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3');

const key = new kms.Key(stack, 'MyKey');
const deleter = new iam.User(stack, 'Deleter');
const bucket = new s3.Bucket(stack, 'MyBucket', {
  encryptionKey: key,
  encryption: s3.BucketEncryption.KMS,
});

// when
bucket.grantDelete(deleter);

new IntegTest(app, 'cdk-integ-s3-grant-delete-kms', {
  testCases: [stack],
});
