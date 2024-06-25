import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ssekms-s3-origin-oac');

const key = new kms.Key(stack, 'Key');
const bucket = new s3.Bucket(stack, 'Bucket', {
  encryptionKey: key,
  encryption: s3.BucketEncryption.KMS,
});
const originAccessControl = new cloudfront.OriginAccessControl(stack, 'OriginAccessControl');
new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket, {
      originAccessControl: originAccessControl
    })
  },
});

new IntegTest(app, 'kms-s3-origin-oac', {
  testCases: [stack],
});
