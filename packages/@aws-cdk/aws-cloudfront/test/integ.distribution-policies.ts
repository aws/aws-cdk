import * as cdk from '@aws-cdk/core';
import { TestOrigin } from './test-origin';
import * as cloudfront from '../lib';
import { OriginRequestPolicy } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-policies');

const cachePolicy = new cloudfront.CachePolicy(stack, 'CachePolicy', {
  cachePolicyName: 'ACustomCachePolicy',
});

const originRequestPolicy = new cloudfront.OriginRequestPolicy(stack, 'OriginRequestPolicy', {
  originRequestPolicyName: 'ACustomOriginRequestPolicy',
  headerBehavior: cloudfront.OriginRequestHeaderBehavior.all('CloudFront-Forwarded-Proto'),
});

const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
  responseHeadersPolicyName: 'ACustomResponseHeadersPolicy',
  corsBehavior: {
    accessControlAllowCredentials: false,
    accessControlAllowHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
    accessControlAllowMethods: ['GET', 'POST'],
    accessControlAllowOrigins: ['*'],
    accessControlExposeHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
    accessControlMaxAge: cdk.Duration.seconds(600),
    originOverride: true,
  },
  removeHeaders: ['Server'],
  serverTimingSamplingRate: 50,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy,
    originRequestPolicy,
    responseHeadersPolicy,
  },
});

new cloudfront.Distribution(stack, 'Dist-2', {
  defaultBehavior: {
    origin: new TestOrigin('www.example-2.com'),
    cachePolicy,
    originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    responseHeadersPolicy,
  },
});

app.synth();
