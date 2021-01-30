import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

new cloudfront.KeyGroup(stack, 'AwesomeKeyGroup', {
  items: [
    new cloudfront.PublicKey(stack, 'AwesomePublicKey', {
      encodedKey: 'awesome-public-key',
    }),
  ],
});

app.synth();
