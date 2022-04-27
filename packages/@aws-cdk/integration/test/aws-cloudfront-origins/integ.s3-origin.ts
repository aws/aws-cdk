import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-s3-origin');

const bucket = new s3.Bucket(stack, 'Bucket');
new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.S3Origin(bucket) },
});

app.synth();
