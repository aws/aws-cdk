import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

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

const testOrigin = new TestOrigin('www.example.com');
new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: testOrigin,
    cachePolicy,
    originRequestPolicy,
    responseHeadersPolicy,
  },
});

new cloudfront.Distribution(stack, 'Dist-2', {
  defaultBehavior: {
    origin: new TestOrigin('www.example-2.com'),
    cachePolicy: cachePolicyWithRef,
    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    responseHeadersPolicy,
  },
});

new cloudfront.Distribution(stack, 'Dist-ManagedPolicy', {
  defaultBehavior: {
    origin: testOrigin,
  },
  additionalBehaviors: {
    ...Object.fromEntries(([
      'AMPLIFY',
      'CACHING_OPTIMIZED',
      'CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS',
      'CACHING_DISABLED',
      'ELEMENTAL_MEDIA_PACKAGE',
    ] as const).map((policyName) => [
      `/cache-policy/${policyName}`,
      {
        origin: testOrigin,
        cachePolicy: cloudfront.CachePolicy[policyName],
      },
    ])),
    ...Object.fromEntries(([
      'USER_AGENT_REFERER_HEADERS',
      'CORS_CUSTOM_ORIGIN',
      'CORS_S3_ORIGIN',
      'ALL_VIEWER',
      'ELEMENTAL_MEDIA_TAILOR',
      'ALL_VIEWER_AND_CLOUDFRONT_2022',
      'ALL_VIEWER_EXCEPT_HOST_HEADER',
      'HOST_HEADER_ONLY',
    ] as const).map((policyName) => [
      `/origin-request-policy/${policyName}`,
      {
        origin: testOrigin,
        originRequestPolicy: cloudfront.OriginRequestPolicy[policyName],
      },
    ])),
    ...Object.fromEntries(([
      'CORS_ALLOW_ALL_ORIGINS',
      'CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT',
      'SECURITY_HEADERS',
      'CORS_ALLOW_ALL_ORIGINS_AND_SECURITY_HEADERS',
      'CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS',
    ] as const).map((policyName) => [
      `/response-headers-policy/${policyName}`,
      {
        origin: testOrigin,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy[policyName],
      },
    ])),
  },
});

new IntegTest(app, 'DistributionPolicies', {
  testCases: [stack],
});

app.synth();
