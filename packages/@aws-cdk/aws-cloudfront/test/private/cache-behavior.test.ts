import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { AllowedMethods, CachedMethods, CachePolicy, KeyGroup, LambdaEdgeEventType, OriginRequestPolicy, PublicKey, ViewerProtocolPolicy } from '../../lib';
import { CacheBehavior } from '../../lib/private/cache-behavior';

let app: App;
let stack: Stack;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('renders the minimum template with an origin and path specified', () => {
  const behavior = new CacheBehavior('origin_id', {
    pathPattern: '*',
  });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: 'origin_id',
    cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
    compress: true,
    pathPattern: '*',
    viewerProtocolPolicy: 'allow-all',
  });
});

test('renders with all properties specified', () => {
  const fnVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1');
  const pubKey = new PublicKey(stack, 'MyPublicKey', {
    encodedKey: publicKey,
  });
  const keyGroup = new KeyGroup(stack, 'MyKeyGroup', {
    items: [
      pubKey,
    ],
  });

  const behavior = new CacheBehavior('origin_id', {
    pathPattern: '*',
    allowedMethods: AllowedMethods.ALLOW_ALL,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    cachePolicy: CachePolicy.CACHING_OPTIMIZED,
    compress: true,
    originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
    smoothStreaming: true,
    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
    edgeLambdas: [{
      eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
      includeBody: true,
      functionVersion: fnVersion,
    }],
    trustedKeyGroups: [keyGroup],
  });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: 'origin_id',
    pathPattern: '*',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
    cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
    compress: true,
    originRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3',
    smoothStreaming: true,
    viewerProtocolPolicy: 'https-only',
    lambdaFunctionAssociations: [{
      lambdaFunctionArn: 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1',
      eventType: 'origin-request',
      includeBody: true,
    }],
    trustedKeyGroups: [
      keyGroup.keyGroupId,
    ],
  });
});

test('throws if edgeLambda includeBody is set for wrong event type', () => {
  const fnVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1');

  expect(() => new CacheBehavior('origin_id', {
    pathPattern: '*',
    edgeLambdas: [{
      eventType: LambdaEdgeEventType.ORIGIN_RESPONSE,
      includeBody: true,
      functionVersion: fnVersion,
    }],
  })).toThrow(/'includeBody' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types./);
});
