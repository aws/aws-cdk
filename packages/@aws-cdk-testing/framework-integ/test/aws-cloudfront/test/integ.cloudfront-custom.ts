import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

new cloudfront.Distribution(stack, 'AnAmazingWebsiteProbably', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('brelandm.a2z.com', {
      customHeaders: { 'X-Custom-Header': 'somevalue' },
    }),
  },
});

app.synth();
