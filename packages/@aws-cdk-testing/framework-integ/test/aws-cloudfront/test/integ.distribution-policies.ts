import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { OriginRequestPolicy } from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-policies');

const cachePolicy = new cloudfront.CachePolicy(stack, 'CachePolicy', {
  cachePolicyName: 'ACustomCachePolicy',
});

const paramMinTtl = new cdk.CfnParameter(stack, 'MinTtlParam', {
  type: 'Number',
  default: '1000',
});
const paramDefaultTtl = new cdk.CfnParameter(stack, 'DefaultTtlParam', {
  type: 'Number',
  default: '2000',
});
const paramMaxTtl = new cdk.CfnParameter(stack, 'MaxTtlParam', {
  type: 'Number',
  default: '3000',
});
const cachePolicyWithRef = new cloudfront.CachePolicy(stack, 'CachePolicyWithRef', {
  minTtl: cdk.Duration.seconds(paramMinTtl.valueAsNumber),
  defaultTtl: cdk.Duration.seconds(paramDefaultTtl.valueAsNumber),
  maxTtl: cdk.Duration.seconds(paramMaxTtl.valueAsNumber),
});

const originRequestPolicy = new cloudfront.OriginRequestPolicy(stack, 'OriginRequestPolicy', {
  originRequestPolicyName: 'ACustomOriginRequestPolicy',
  cookieBehavior: cloudfront.OriginRequestCookieBehavior.allowList('cookie1'),
  headerBehavior: cloudfront.OriginRequestHeaderBehavior.all('CloudFront-Forwarded-Proto'),
  queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.denyList('querystringparam'),
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
    cachePolicy: cachePolicyWithRef,
    originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    responseHeadersPolicy,
  },
});

new IntegTest(app, 'DistributionPolicies', {
  testCases: [stack],
});

app.synth();
