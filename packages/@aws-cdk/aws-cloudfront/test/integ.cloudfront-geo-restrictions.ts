import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-geo-restrictions');

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors: [{ isDefaultBehavior: true }],
    },
  ],
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});

app.synth();
