import { getV3ClientPackageName } from '../lib';

test('can map service name to SDK v3 client name', () => {
  expect(getV3ClientPackageName('S3')).toBe('@aws-sdk/client-s3');
});

test('will fail for unknown service', () => {
  expect(() => getV3ClientPackageName('FOOBAR')).toThrow();
});
