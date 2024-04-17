import { ApiCall, InvokeOptions, coerceSdkv3Response, flatten } from '../lib';

test('can map service name to SDK v3 client name', () => {
  expect(new ApiCall('S3', 'Bla').v3PackageName).toBe('@aws-sdk/client-s3');
});

test.each([
  'api-gateway',
  '@aws-sdk/client-api-gateway',
  'APIGateway',
  'apigateway',
])('service %p is recognized', (service) => {
  expect(new ApiCall(service, 'Bla').v3PackageName).toEqual('@aws-sdk/client-api-gateway');
});

test.each([
  'GetRestApi',
  'getRestApi',
  'GetRestApiCommand',
])('action %p is recognized', (action) => {
  expect(new ApiCall('api-gateway', action).action).toEqual('GetRestApi');
});

test.each([
  'ExecuteCommand',
  'executeCommand',
  'ExecuteCommandCommand',
])('ECS action %p is recognized', (action) => {
  expect(new ApiCall('ecs', action).action).toEqual('ExecuteCommand');
});

describe('helpers for SDKv3', () => {
  test('can load a SDK package by service name', () => {
    const sdk = new ApiCall('S3', 'Bla');
    expect(sdk.v3PackageName).toBe('@aws-sdk/client-s3');
    sdk.initializePackage();
  });

  test('can load a SDK package by package name', () => {
    const sdk = new ApiCall('@aws-sdk/client-s3', 'Bla');
    expect(sdk.v3PackageName).toBe('@aws-sdk/client-s3');
    sdk.initializePackage();
  });

  test('will throw when attempting to load unknown SDK package', () => {
    expect(() => {
      loadV3ClientPackage('@aws-sdk/client-foobar');
    }).toThrow("Service foobar client package with name '@aws-sdk/client-foobar' does not exist.");
  });

  test('will throw when attempting to load unknown SDK package using V2 style name', () => {
    expect(() => {
      loadV3ClientPackage('FooBar');
    }).toThrow("Service foobar client package with name '@aws-sdk/client-foobar' does not exist.");
  });

  describe('with a SDK package loaded', () => {
    test('can get client', () => {
      const client = getV3Client('s3');
      expect(client.config.serviceId).toBe('S3');
    });

    test('can get client with config', async () => {
      const client = getV3Client('s3', { region: 'eu-west-1' });
      const region = await client.config.region();
      expect(region).toBe('eu-west-1');
    });

    test('can get command', () => {
      const apiCall = new ApiCall('s3', 'ListBuckets');
      const command = apiCall.findCommandClass();
      expect(command).toBeDefined();
    });
    test('will throw when attempting to get unknown command', () => {
      expect(() => {
        new ApiCall('s3', 'FooBar').findCommandClass();
      }).toThrow('Unable to find command named: FooBarCommand');
    });
  });
});

test('flatten', () => {
  expect(flatten({
    foo: 'foo',
    bar: {
      foo: 'foo',
      bar: 'bar',
    },
    baz: [
      { foo: 'foo' },
      { bar: 'bar' },
    ],
  })).toEqual({
    'foo': 'foo',
    'bar.foo': 'foo',
    'bar.bar': 'bar',
    'baz.0.foo': 'foo',
    'baz.1.bar': 'bar',
  });
});

test.each([
  { transformToString: () => 'foo' },
  Buffer.from('foo'),
  new TextEncoder().encode('foo'),
])('coerce %p', async (fooValue) => {
  expect(await coerceSdkv3Response({
    foo: fooValue,
  })).toEqual({ foo: 'foo' });
});

function loadV3ClientPackage(service: string) {
  const apiCall = new ApiCall(service, 'Bla');
  apiCall.initializePackage();
  return apiCall.v3Package;
}

function getV3Client(service: string, options: Omit<InvokeOptions, 'parameters'> = {}) {
  const apiCall = new ApiCall(service, 'Bla');
  apiCall.initializePackage();
  apiCall.initializeClient(options);
  return apiCall.client;
}
