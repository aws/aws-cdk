import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-http-origin');

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});

app.synth();
