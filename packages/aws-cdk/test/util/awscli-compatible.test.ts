import * as AWS from 'aws-sdk';
import { AwsCliCompatible } from '../../lib/api/aws-auth/awscli-compatible';
import { withMockedClassSingleton } from '../util';

beforeEach(() => {
  // Set to paths that don't exist so the SDK doesn't accidentally load this config
  process.env.AWS_CONFIG_FILE = '/home/dummydummy/.bxt/config';
  process.env.AWS_SHARED_CREDENTIALS_FILE = '/home/dummydummy/.bxt/credentials';
  // Scrub some environment variables that might be set if we're running on CodeBuild which will interfere with the tests.
  delete process.env.AWS_REGION;
  delete process.env.AWS_DEFAULT_REGION;
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  delete process.env.AWS_SESSION_TOKEN;
});

test('on an EC2 instance, region lookup queries IMDS', async () => {
  return withMockedClassSingleton(AWS, 'MetadataService', async (mdService) => {
    mdService.request
      // First call for a token
      .mockImplementationOnce((_1, _2, cb) => { cb(undefined as any, 'token'); })
      // Second call for the region
      .mockImplementationOnce((_1, _2, cb) => { cb(undefined as any, JSON.stringify({ region: 'some-region' })); });

    const region = await AwsCliCompatible.region({ ec2instance: true });
    expect(region).toEqual('some-region');
  });
});

