import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-s3');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const oai = new cloudfront.CfnCloudFrontOriginAccessIdentity(stack, 'OAI', {
  cloudFrontOriginAccessIdentityConfig: {
    comment: 'Allows CloudFront to reach the bucket!',
  },
});

const oaiImported = cloudfront.OriginAccessIdentity.fromOriginAccessIdentityName(
  stack,
  'OAIImported',
  oai.ref,
);

const dist = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessIdentity: oaiImported,
    },
  }],
});

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
