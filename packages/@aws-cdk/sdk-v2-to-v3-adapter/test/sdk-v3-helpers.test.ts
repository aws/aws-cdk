import { getV3Client, getV3Command, loadV3ClientPackage } from '../lib';

describe('helpers for SDKv3', () => {
  test('can load a SDK package by service name', () => {
    const sdk = loadV3ClientPackage('S3');

    expect(sdk.packageName).toBe('@aws-sdk/client-s3');
    expect(sdk.service).toBe('s3');
    expect(sdk.packageVersion).toMatch(/^3\..*/);
  });

  test('can load a SDK package by package name', () => {
    const sdk = loadV3ClientPackage('@aws-sdk/client-s3');

    expect(sdk.packageName).toBe('@aws-sdk/client-s3');
    expect(sdk.service).toBe('s3');
    expect(sdk.packageVersion).toMatch(/^3\..*/);
  });

  test('will throw when attempting to load unknown SDK package', () => {
    expect(() => {
      loadV3ClientPackage('@aws-sdk/client-foobar');
    }).toThrow("Service @aws-sdk/client-foobar client package with name '@aws-sdk/client-foobar' does not exist.");
  });

  test('will throw when attempting to load unknown SDK package using V2 style name', () => {
    expect(() => {
      loadV3ClientPackage('FooBar');
    }).toThrow("Client 'FooBar' is either deprecated or newly added.");
  });

  describe('with a SDK package loaded', () => {
    const sdk = loadV3ClientPackage('@aws-sdk/client-s3');

    test('can get client', () => {
      const client = getV3Client(sdk);
      expect(client.config.serviceId).toBe('S3');
    });

    test('can get client with config', async () => {
      const client = getV3Client(sdk, { region: 'eu-west-1' });
      const region = await client.config.region();
      expect(region).toBe('eu-west-1');
    });

    test('can get command', () => {
      const command = getV3Command(sdk, 'ListBuckets');
      expect(command).toBeDefined();
    });
    test('will throw when attempting to get unknown command', () => {
      expect(() => {
        getV3Command(sdk, 'FooBar');
      }).toThrow('Unable to find command named: FooBarCommand');
    });
  });
});
