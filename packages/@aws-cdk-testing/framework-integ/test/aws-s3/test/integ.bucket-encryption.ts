import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-bucket-encryption');

new s3.Bucket(stack, 'MyDSSEBucket', {
  encryption: s3.BucketEncryption.DSSE_MANAGED,
});

new s3.Bucket(stack, 'MySSES3Bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  bucketKeyEnabled: true,
});

new s3.Bucket(stack, 'MyKMSBucket', {
  encryption: s3.BucketEncryption.KMS,
});

new integ.IntegTest(app, 'IntegTestDSSEBucket', {
  testCases: [stack],
});

app.synth();
