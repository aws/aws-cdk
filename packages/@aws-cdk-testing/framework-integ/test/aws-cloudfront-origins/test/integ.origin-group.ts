import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

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
