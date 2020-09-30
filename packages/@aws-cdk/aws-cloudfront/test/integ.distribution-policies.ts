import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-policies');

const cachePolicy = new cloudfront.CachePolicy(stack, 'CachePolicy', {
  cachePolicyName: 'A custom cache policy',
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy,
  },
});

app.synth();
