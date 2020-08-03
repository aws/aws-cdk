import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { AllowedMethods } from '../../lib';
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
    forwardQueryString: true,
    forwardQueryStringCacheKeys: ['user_id', 'auth'],
  });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: 'origin_id',
    pathPattern: '*',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    forwardedValues: {
      queryString: true,
      queryStringCacheKeys: ['user_id', 'auth'],
    },
    viewerProtocolPolicy: 'allow-all',
  });
});
