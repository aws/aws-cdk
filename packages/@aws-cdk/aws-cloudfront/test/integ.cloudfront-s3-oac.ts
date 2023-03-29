import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as cloudfront from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-s3-oac');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const oac = new cloudfront.CfnOriginAccessControl(stack, 'OAC', {
  originAccessControlConfig: {
    name: 'OACId',
    originAccessControlOriginType: 's3',
    signingBehavior: 'always',
    signingProtocol: 'sigv4',
  },
});

const oacImport = cloudfront.OriginAccessControl.fromOriginAccessControlId(
  stack,
  'OACImport',
  oac.ref,
);

new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessControl: oacImport,
    },
  }],
});

new IntegTest(app, 'S3OriginAccessControl', {
  testCases: [stack],
});

app.synth();