import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

const loggingBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
});

new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
  originConfigs: [
    {
      originHeaders: {
        'X-Custom-Header': 'somevalue',
      },
      customOriginSource: {
        domainName: 'brelandm.a2z.com',
      },
      behaviors: [
        {
          isDefaultBehavior: true,
        },
      ],
    },
  ],
  loggingConfig: {
    bucket: loggingBucket,
    includeCookies: true,
    prefix: 'test-prefix',
  },
});

const loggingBucket2 = new s3.Bucket(stack, 'LoggingBucket2', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
});

new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably2', {
  originConfigs: [
    {
      originHeaders: {
        'X-Custom-Header': 'somevalue',
      },
      customOriginSource: {
        domainName: 'brelandm.a2z.com',
      },
      behaviors: [
        {
          isDefaultBehavior: true,
        },
      ],
    },
  ],
  loggingConfig: {
    bucket: loggingBucket2,
  },
});

app.synth();
