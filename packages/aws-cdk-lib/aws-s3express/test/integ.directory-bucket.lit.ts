import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as s3express from '../lib';

class DirectoryBucketStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    // Create a directory bucket in an Availability Zone
    const bucket = new s3express.DirectoryBucket(this, 'MyDirectoryBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // Create a directory bucket with KMS encryption
    const encryptionKey = new kms.Key(this, 'BucketKey', {
      description: 'Key for S3 Express directory bucket encryption',
    });

    const encryptedBucket = new s3express.DirectoryBucket(this, 'EncryptedBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
      encryption: s3express.DirectoryBucketEncryption.KMS,
      encryptionKey,
    });

    // Create a Lambda function and grant it access to the bucket
    const fn = new lambda.Function(this, 'MyFunction', {
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

    bucket.grantReadWrite(fn);
    encryptedBucket.grantRead(fn);
    /// !hide
  }
}

const app = new cdk.App();

new DirectoryBucketStack(app, 's3express-directory-bucket-integ');

app.synth();
