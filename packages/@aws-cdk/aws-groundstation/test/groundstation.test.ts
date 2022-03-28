import '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import {} from 'aws-cdk-lib'
import { MissionProfile, S3RecordingConfig } from '../lib';

test('No tests are specified for this package', () => {
  expect(true).toBe(true);
});

describe('Groundstation Config', () => {
  test('No tests are specified for this package', () => {
    expect(true).toBe(true);
  });

  test('S3RecordingConfig', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bucket = new Bucket(app, 'Bucket');

    const config = new S3RecordingConfig(stack, 'S3Config', {
      BucketArn: 
      bucket: 'bucket',
      prefix: 'prefix',
    });
    expect(config.bucket).toEqual('bucket');
    expect(config.prefix).toEqual('prefix');
  });
});
