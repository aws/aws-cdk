import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { AllowedMethods, CachedMethods, ViewerProtocolPolicy } from '../../lib';
import { CacheBehavior } from '../../lib/private/cache-behavior';

let app: App;

beforeEach(() => {
  app = new App();
  new Stack(app, 'Stack', {
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
  const behavior = new CacheBehavior('origin_id', {
    pathPattern: '*',
    allowedMethods: AllowedMethods.ALLOW_ALL,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    compress: true,
    forwardQueryString: true,
    forwardQueryStringCacheKeys: ['user_id', 'auth'],
    smoothStreaming: true,
    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
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
  });
});
