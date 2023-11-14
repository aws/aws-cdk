
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

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
  defaultRootObject: '',
});

app.synth();
