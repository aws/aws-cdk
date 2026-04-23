#!/usr/bin/env node
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3express from 'aws-cdk-lib/aws-s3express';

const app = new cdk.App();

const stack = new cdk.Stack(app, 's3express-directory-bucket-integ');

// Create a directory bucket in an Availability Zone
// Note: availabilityZone must be the Availability Zone ID (e.g., 'use1-az1'), not the name
const bucket = new s3express.DirectoryBucket(stack, 'MyDirectoryBucket', {
  location: {
    availabilityZone: 'use1-az4',
  },
});

// Create a directory bucket with KMS encryption
const encryptionKey = new kms.Key(stack, 'BucketKey', {
  description: 'Key for S3 Express directory bucket encryption',
});

const encryptedBucket = new s3express.DirectoryBucket(stack, 'EncryptedBucket', {
  location: {
    availabilityZone: 'use1-az4',
  },
  encryption: s3express.DirectoryBucketEncryption.KMS,
  encryptionKey,
});

// Create a Lambda function and grant it access to the bucket
const fn = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async function(event) {
      console.log('Bucket:', process.env.BUCKET_NAME);
      return { statusCode: 200, body: 'OK' };
    };
  `),
  environment: {
    BUCKET_NAME: bucket.bucketName,
  },
});

bucket.grants.readWrite(fn);
encryptedBucket.grants.read(fn);

new IntegTest(app, 'DirectoryBucketTest', {
  testCases: [stack],
});
