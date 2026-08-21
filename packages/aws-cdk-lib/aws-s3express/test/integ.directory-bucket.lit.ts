import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as s3express from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 's3express-directory-bucket-lit');

/// !show
// Create a directory bucket in an Availability Zone
// Note: Use Availability Zone ID (e.g., 'use1-az1'), not name (e.g., 'us-east-1a')
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
/// !hide
