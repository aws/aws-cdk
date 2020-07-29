import '@aws-cdk/assert/jest';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { App, Duration, Stack } from '@aws-cdk/core';
import { HttpOrigin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('Renders minimal example with just a domain name', () => {
  const origin = new HttpOrigin('www.example.com');
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toEqual({
    id: 'StackOrigin029E19582',
    domainName: 'www.example.com',
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
    },
  });
});

test('Can customize properties of the origin', () => {
  const origin = new HttpOrigin('www.example.com', {
    customHeaders: { AUTH: 'NONE' },
    readTimeout: Duration.seconds(10),
    protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
  });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toEqual({
    id: 'StackOrigin029E19582',
    domainName: 'www.example.com',
    originCustomHeaders: [{
      headerName: 'AUTH',
      headerValue: 'NONE',
    }],
    customOriginConfig: {
      originProtocolPolicy: 'match-viewer',
      originReadTimeout: 10,
    },
  });
});
