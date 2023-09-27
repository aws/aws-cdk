import { ApiCall } from '../lib';

test('can map service name to SDK v3 client name', () => {
  expect(new ApiCall('S3', 'Bla').v3PackageName).toBe('@aws-sdk/client-s3');
});

test('will fail for unknown service', () => {
  expect(() => getV3ClientPackageName('FOOBAR')).toThrow();
});
