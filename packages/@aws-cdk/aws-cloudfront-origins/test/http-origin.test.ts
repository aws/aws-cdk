import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { App, Duration, Stack } from '@aws-cdk/core';
import { HttpOrigin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  new Stack(app, 'Stack', {
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
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('renders an example with all available props', () => {
  const origin = new HttpOrigin('www.example.com', {
    originPath: '/app',
    connectionTimeout: Duration.seconds(5),
    connectionAttempts: 2,
    customHeaders: { AUTH: 'NONE' },
    protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
    httpPort: 8080,
    httpsPort: 8443,
    readTimeout: Duration.seconds(45),
    keepaliveTimeout: Duration.seconds(3),
    originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
  });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toEqual({
    id: 'StackOrigin029E19582',
    domainName: 'www.example.com',
    originPath: '/app',
    connectionTimeout: 5,
    connectionAttempts: 2,
    originCustomHeaders: [{
      headerName: 'AUTH',
      headerValue: 'NONE',
    }],
    customOriginConfig: {
      originProtocolPolicy: 'match-viewer',
      originSslProtocols: [
        'TLSv1.2',
      ],
      httpPort: 8080,
      httpsPort: 8443,
      originReadTimeout: 45,
      originKeepaliveTimeout: 3,
    },
  });
});

test.each([
  Duration.seconds(0),
  Duration.seconds(181),
  Duration.minutes(5),
])('validates readTimeout is an integer between 1 and 180 seconds - out of bounds', (readTimeout) => {
  expect(() => {
    new HttpOrigin('www.example.com', {
      readTimeout,
    });
  }).toThrow(`readTimeout: Must be an int between 1 and 180 seconds (inclusive); received ${readTimeout.toSeconds()}.`);
});

test.each([
  Duration.seconds(0.5),
  Duration.seconds(60.5),
])('validates readTimeout is an integer between 1 and 180 seconds - not an int', (readTimeout) => {
  expect(() => {
    new HttpOrigin('www.example.com', {
      readTimeout,
    });
  }).toThrow(/must be a whole number of/);
});

test.each([
  Duration.seconds(0),
  Duration.seconds(181),
  Duration.minutes(5),
])('validates keepaliveTimeout is an integer between 1 and 180 seconds - out of bounds', (keepaliveTimeout) => {
  expect(() => {
    new HttpOrigin('www.example.com', {
      keepaliveTimeout,
    });
  }).toThrow(`keepaliveTimeout: Must be an int between 1 and 180 seconds (inclusive); received ${keepaliveTimeout.toSeconds()}.`);
});

test.each([
  Duration.seconds(0.5),
  Duration.seconds(60.5),
])('validates keepaliveTimeout is an integer between 1 and 180 seconds - not an int', (keepaliveTimeout) => {
  expect(() => {
    new HttpOrigin('www.example.com', {
      keepaliveTimeout,
    });
  }).toThrow(/must be a whole number of/);
});
