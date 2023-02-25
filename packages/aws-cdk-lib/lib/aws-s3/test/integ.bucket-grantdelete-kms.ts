#!/usr/bin/env node
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import * as s3 from '../lib';

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

app.synth();