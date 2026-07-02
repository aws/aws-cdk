import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

const loggingBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
});

new cloudfront.Distribution(stack, 'AnAmazingWebsiteProbably', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('brelandm.a2z.com', {
      customHeaders: { 'X-Custom-Header': 'somevalue' },
    }),
  },
  enableLogging: true,
  logBucket: loggingBucket,
  logIncludesCookies: true,
  logFilePrefix: 'test-prefix',
});

const loggingBucket2 = new s3.Bucket(stack, 'LoggingBucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
});

new cloudfront.Distribution(stack, 'AnAmazingWebsiteProbably2', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('brelandm.a2z.com', {
      customHeaders: { 'X-Custom-Header': 'somevalue' },
    }),
  },
  enableLogging: true,
  logBucket: loggingBucket2,
});

app.synth();
