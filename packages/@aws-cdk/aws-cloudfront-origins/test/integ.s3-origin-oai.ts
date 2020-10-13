import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as origins from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-origin-oai');

const bucket = new s3.Bucket(stack, 'Bucket');
const originAccessIdentity = new cloudfront.OriginAccessIdentity(stack, 'OriginAccessIdentity', {
  comment: 'Identity for bucket provided by test',
});
new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.S3Origin(bucket, { originAccessIdentity }) },
});

app.synth();
