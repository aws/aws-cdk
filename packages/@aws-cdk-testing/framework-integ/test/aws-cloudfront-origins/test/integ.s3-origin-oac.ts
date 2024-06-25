import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-origin-oac');

const bucket = new s3.Bucket(stack, 'Bucket');
const originAccessControl = new cloudfront.OriginAccessControl(stack, 'OriginAccessControl');
new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket, {
      originAccessControl: originAccessControl,
    }),
  },
});

new IntegTest(app, 's3-origin-oac', {
  testCases: [stack],
});
