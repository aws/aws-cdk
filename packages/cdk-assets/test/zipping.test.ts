import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import { mockAws, mockedApiResult } from './mock-aws';
import * as mockfs from './mock-fs';
import { AssetManifest, AssetPublishing } from '../lib';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: 'some_dir',
            packaging: 'zip',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/some_dir/some_file': 'FILE_CONTENTS',
  });

  aws = mockAws();

  // Accept all S3 uploads as new
  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
});

afterEach(() => {
  mockfs.restore();
});

test('Take a zipped upload', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath(mockfs.path('/simple/cdk.out')), { aws });

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
    ContentType: 'application/zip',
  }));
});
