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
  aliasConfiguration: {
    acmCertRef: 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
    names: ['test.test.com'],
    sslMethod: cloudfront.SSLMethod.SNI,
    securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
  },
});

app.synth();
