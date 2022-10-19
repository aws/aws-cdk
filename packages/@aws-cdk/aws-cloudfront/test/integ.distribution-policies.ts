import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

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
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy,
    originRequestPolicy,
    responseHeadersPolicy,
  },
});

app.synth();
