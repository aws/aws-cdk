import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import * as origins from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-http-origin');

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});

app.synth();
