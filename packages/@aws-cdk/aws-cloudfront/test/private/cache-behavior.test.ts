import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { AllowedMethods, CachedMethods, LambdaEdgeEventType, ViewerProtocolPolicy } from '../../lib';
import { CacheBehavior } from '../../lib/private/cache-behavior';

let app: App;
let stack: Stack;

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
    pathPattern: '*',
    forwardedValues: { queryString: false },
    viewerProtocolPolicy: 'allow-all',
  });
});

test('renders with all properties specified', () => {
  const fnVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1');
  const behavior = new CacheBehavior('origin_id', {
    pathPattern: '*',
    allowedMethods: AllowedMethods.ALLOW_ALL,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    compress: true,
    forwardQueryString: true,
    forwardQueryStringCacheKeys: ['user_id', 'auth'],
    smoothStreaming: true,
    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
    edgeLambdas: [{
      eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
      includeBody: true,
      functionVersion: fnVersion,
    }],
  });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: 'origin_id',
    pathPattern: '*',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
    compress: true,
    forwardedValues: {
      queryString: true,
      queryStringCacheKeys: ['user_id', 'auth'],
    },
    smoothStreaming: true,
    viewerProtocolPolicy: 'https-only',
    lambdaFunctionAssociations: [{
      lambdaFunctionArn: 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1',
      eventType: 'origin-request',
      includeBody: true,
    }],
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
