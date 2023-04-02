import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

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
