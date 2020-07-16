import '@aws-cdk/assert/jest';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { AllowedMethods, Origin } from '../../lib';
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
  const origin = Origin.fromBucket(new s3.Bucket(stack, 'MyBucket'));
  const behavior = new CacheBehavior({
    origin,
    pathPattern: '*',
  });
  origin._bind(stack, { originIndex: 0 });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: behavior.origin.id,
    pathPattern: '*',
    forwardedValues: { queryString: false },
    viewerProtocolPolicy: 'allow-all',
  });
});

test('renders with all properties specified', () => {
  const origin = Origin.fromBucket(new s3.Bucket(stack, 'MyBucket'));
  const behavior = new CacheBehavior({
    origin,
    pathPattern: '*',
    allowedMethods: AllowedMethods.ALLOW_ALL,
    forwardQueryString: true,
    forwardQueryStringCacheKeys: ['user_id', 'auth'],
  });
  origin._bind(stack, { originIndex: 0 });

  expect(behavior._renderBehavior()).toEqual({
    targetOriginId: behavior.origin.id,
    pathPattern: '*',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    forwardedValues: {
      queryString: true,
      queryStringCacheKeys: ['user_id', 'auth'],
    },
    viewerProtocolPolicy: 'allow-all',
  });
});