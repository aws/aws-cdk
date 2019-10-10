import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cloudfront = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

const loggingBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
});

new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
  originConfigs: [
    {
      originHeaders: {
        "X-Custom-Header": "somevalue",
      },
      customOriginSource: {
        domainName: "brelandm.a2z.com",
      },
      behaviors: [
        {
        isDefaultBehavior: true,
        }
      ]
    }
  ],
  loggingConfig: {
    bucket: loggingBucket,
    includeCookies: true,
    prefix: 'test-prefix'
  }
});

new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably2', {
  originConfigs: [
    {
      originHeaders: {
        "X-Custom-Header": "somevalue",
      },
      customOriginSource: {
        domainName: "brelandm.a2z.com",
      },
      behaviors: [
        {
        isDefaultBehavior: true,
        }
      ]
    }
  ],
  loggingConfig: {}
});

app.synth();
