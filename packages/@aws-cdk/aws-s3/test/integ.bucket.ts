#!/usr/bin/env node
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-s3');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  encryption: s3.BucketEncryption.Kms
});

const otherwiseEncryptedBucket = new s3.Bucket(stack, 'MyOtherBucket', {
  encryption: s3.BucketEncryption.S3Managed
});

const user = new iam.User(stack, 'MyUser');
bucket.grantReadWrite(user);
otherwiseEncryptedBucket.grantRead(user);

process.stdout.write(app.run());
