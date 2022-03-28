import '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { S3RecordingConfig } from '../lib';

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
    const role = new Role(app, 'Role', {
      assumedBy: new ServicePrincipal('groundstation.amazonaws.com'),
    });

    const config = new S3RecordingConfig(stack, 'S3Config', {
      bucketArn: bucket.bucketArn,
      name: 'S3_Config',
      roleArn: role.roleArn,
    });
    expect(config).toBeDefined();
    // expect(config.prefix).toEqual('prefix');
  });
});
