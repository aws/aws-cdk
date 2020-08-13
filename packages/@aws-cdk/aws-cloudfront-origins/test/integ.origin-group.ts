import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as origins from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-origin-group');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const originGroup = new origins.OriginGroup({
  primaryOrigin: new origins.S3Origin(bucket),
  fallbackOrigin: new origins.HttpOrigin('www.example.com'),
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: originGroup },
  additionalBehaviors: {
    '/api': {
      origin: originGroup,
    },
  },
});

app.synth();
