import { App, Stack, Duration } from '@aws-cdk/core';
import { TestOrigin } from './test-origin';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test.each([
  Duration.seconds(0),
  Duration.seconds(11),
  Duration.minutes(5),
])('validates connectionTimeout is an int between 1 and 10 seconds - out of bounds', (connectionTimeout) => {
  expect(() => {
    new TestOrigin('www.example.com', {
      connectionTimeout,
    });
  }).toThrow(`connectionTimeout: Must be an int between 1 and 10 seconds (inclusive); received ${connectionTimeout.toSeconds()}.`);
});

test.each([
  Duration.seconds(0.5),
  Duration.seconds(10.5),
])('validates connectionTimeout is an int between 1 and 10 seconds - not an int', (connectionTimeout) => {
  expect(() => {
    new TestOrigin('www.example.com', {
      connectionTimeout,
    });
  }).toThrow(/must be a whole number of/);
});

test.each([-0.5, 0.5, 1.5, 4])
('validates connectionAttempts is an int between 1 and 3', (connectionAttempts) => {
  expect(() => {
    new TestOrigin('www.example.com', {
      connectionAttempts,
    });
  }).toThrow(`connectionAttempts: Must be an int between 1 and 3 (inclusive); received ${connectionAttempts}.`);
});

test.each(['api', '/api', '/api/', 'api/'])
('enforces that originPath starts but does not end, with a /', (originPath) => {
  const origin = new TestOrigin('www.example.com', {
    originPath,
  });
  const originBindConfig = origin.bind(stack, { originId: '0' });

  expect(originBindConfig.originProperty?.originPath).toEqual('/api');
});


test.each(['us-east-1', 'ap-southeast-2', 'eu-west-3', 'me-south-1'])
('ensures that originShieldRegion is a valid aws region', (originShieldRegion) => {
  const origin = new TestOrigin('www.example.com', {
    originShieldRegion,
  });
  const originBindConfig = origin.bind(stack, { originId: '0' });

  expect(originBindConfig.originProperty?.originShield).toEqual({
    enabled: true,
    originShieldRegion,
  });
});


test('ensures originShield doesnt return false if undefined', () => {
  const origin = new TestOrigin('www.example.com', {

  });
  const originBindConfig = origin.bind(stack, { originId: '0' });

  expect(originBindConfig.originProperty?.originShield).toBeUndefined();
});


test('ensures originShield is disabled if originShieldEnabled equals false', () => {
  const origin = new TestOrigin('www.example.com', {
    originShieldEnabled: false,
  });
  const originBindConfig = origin.bind(stack, { originId: '0' });

  expect(originBindConfig.originProperty?.originShield).toEqual({
    enabled: false,
  });
});


test('throw an error if Custom Headers keys are not permitted', () => {
  // case sensitive
  expect(() => {
    new TestOrigin('example.com', {
      customHeaders: {
        Host: 'bad',
        Cookie: 'bad',
        Connection: 'bad',
        TS: 'bad',
      },
    });
  }).toThrow(/The following headers cannot be configured as custom origin headers: (.*?)/);

  // case insensitive
  expect(() => {
    new TestOrigin('example.com', {
      customHeaders: {
        hOst: 'bad',
        cOOkIe: 'bad',
        Connection: 'bad',
        Ts: 'bad',
      },
    });
  }).toThrow(/The following headers cannot be configured as custom origin headers: (.*?)/);
});

test('throw an error if Custom Headers are pre-fixed with non-permitted keys', () => {
  // case sensitive
  expect(() => {
    new TestOrigin('example.com', {
      customHeaders: {
        'X-Amz-dummy': 'bad',
        'X-Edge-dummy': 'bad',
      },
    });
  }).toThrow(/The following headers cannot be used as prefixes for custom origin headers: (.*?)/);

  // case insensitive
  expect(() => {
    new TestOrigin('example.com', {
      customHeaders: {
        'x-amZ-dummy': 'bad',
        'x-eDgE-dummy': 'bad',
      },
    });
  }).toThrow(/The following headers cannot be used as prefixes for custom origin headers: (.*?)/);
});
