import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

const loggingBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
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
  loggingConfig: {},
});

app.synth();
