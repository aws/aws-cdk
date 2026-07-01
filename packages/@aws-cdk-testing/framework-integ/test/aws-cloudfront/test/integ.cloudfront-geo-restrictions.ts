import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-geo-restrictions');

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cloudfront.Distribution(stack, 'MyDistribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(sourceBucket),
  },
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});

app.synth();