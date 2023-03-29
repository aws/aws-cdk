import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as cloudfront from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-s3-oac-l2');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const oac = new cloudfront.OriginAccessControl(stack, 'OACL2', {
  originType: cloudfront.OriginAccessControlOriginType.S3,
});

new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessControl: oac,
    },
  }],
});

new cloudfront.CloudFrontWebDistribution(stack, 'Distribution2', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessControl: true,
    },
  }],
});

new cloudfront.CloudFrontWebDistribution(stack, 'Distribution3', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessControl: cloudfront.OriginAccessControl.fromS3Defaults(stack),
    },
  }],
});

new IntegTest(app, 'S3OriginAccessControlL2', {
  testCases: [stack],
});

app.synth();